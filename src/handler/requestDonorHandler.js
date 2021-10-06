const Cache = require('../cache/cache');
const DonorRequest = require('../model/donorrequest');
class RequestDonorHandler {
    prefix = "REQ_DONOR_";
    constructor(client, dbRepository, waRepository){
        this.cache = new Cache();
        this.client = client;
        this.dbRepository = dbRepository;
        this.waRepository = waRepository;
    }

    func = [
        { waitForInput: true, action : this._askName },
        { waitForInput: false, action : this._retrieveName },
        { waitForInput: true, action : this._askAge },
        { waitForInput: false, action : this._retrieveAge },
        { waitForInput: true, action : this._askBloodType },
        { waitForInput: false, action : this._retrieveBloodType },
        { waitForInput: true, action : this._askCondition },
        { waitForInput: false, action : this._retrieveCondition },
        { waitForInput: true, action : this._askHospitalName },
        { waitForInput: false, action : this._retrieveHospitalName },
        { waitForInput: true, action : this._askCity },
        { waitForInput: false, action : this._retrieveCity },
        { waitForInput: true, action : this._askProvince },
        { waitForInput: false, action : this._retrieveProvince },
        { waitForInput: true, action : this._askBloodSackAmount },
        { waitForInput: false, action : this._retrieveBloodSackAmount },
        { waitForInput: true, action : this._askContactPerson },
        { waitForInput: false, action : this._retrieveContactPerson },
        { waitForInput: true, action : this._askContactNumber },
        { waitForInput: false, action : this._retrieveContactNumber },
        { waitForInput: true, action : this._finalize }
    ];

    async handle(sessionData, message){
        var user = sessionData.user;
        var thisInstance = this;
        do {
            await this.func[sessionData.substep].action(thisInstance, user, message, sessionData);
        } while(sessionData.substep < this.func.length && this.func[sessionData.substep++].waitForInput == false);
    }
    async _firstMenu(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Selamat datang di layanan pencarian donor plasma Covid19. Tahap berikutnya adalah silahkan mengisi data anda.");
    }

    async _updateCache(user, reqdonor){
        this.cache.set(this.prefix + user.id, reqdonor);
    }

    async _getCache(user){
        return this.cache.get(this.prefix + user.id);
    }

    async _invalidInput(user, message, sessionData){
        await this.client.sendText(user.id, "Mohon maaf namun input anda yang masukkan salah. Mohon inputkan kembali");
        sessionData.substep--;
        var thisInstance = this;
        do {
            await this.func[sessionData.substep].action(thisInstance, user, message, sessionData);
        } while(sessionData.substep < this.func.length && this.func[sessionData.substep++].waitForInput == false);
        sessionData.substep--;
    }

    async _askName(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Masukkan nama Pasien yang membutuhkan donor plasma : ");
    }
    
    async _retrieveName(obj, user, message, sessionData){
        var reqDonor = new DonorRequest();
        reqDonor.setName(message.body);
        await obj._updateCache(user, reqDonor);
    }

    async _askAge(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Masukkan umur Pasien yang membutuhkan donor plasma (1-99) : ");
    }
    
    async _retrieveAge(obj, user, message, sessionData){
        var age = parseInt(message.body);
        if(isNaN(age) || age > 99 || age <= 0){
            console.log("invalid age");
            await obj._invalidInput(user, message, sessionData);
            return;
        }
        var reqDonor = await obj._getCache(user);
        reqDonor.setAge(age);
        await obj._updateCache(user, reqDonor);
    }

    async _askBloodType(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Masukkan golongan darah Pasien yang membutuhkan donor plasma (A-+/B-+/AB-+/O-+) : ");
    }

    async _retrieveBloodType(obj, user, message, sessionData){
        var validBloodType = ['A-','B-','AB-','O-','A+','B+','AB+','O+'];
        var bloodType = message.body.replace(' ','');
        if (validBloodType.indexOf(bloodType.toUpperCase()) === -1){
            await obj._invalidInput(user, message, sessionData);
            return;
        }
        var reqDonor = await obj._getCache(user);
        reqDonor.setBloodType(bloodType.toUpperCase());
        await obj._updateCache(user, reqDonor);
    }

    async _askCondition(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Kondisi pasien saat ini : ");
    }

    async _retrieveCondition(obj, user, message, sessionData){
        var reqDonor = await obj._getCache(user);
        reqDonor.setCondition(message.body);
        await obj._updateCache(user, reqDonor);
    }

    async _askHospitalName(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Nama Rumah Sakit tempat pasien dirawat : ");
    }

    async _retrieveHospitalName(obj, user, message, sessionData){
        var reqDonor = await obj._getCache(user);
        reqDonor.setHospital(message.body);
        await obj._updateCache(user, reqDonor);
    }

    async _askCity(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Masukkan Nama Kota Pasien saat ini berada : ");
    }

    async _retrieveCity(obj, user, message, sessionData){
        var reqDonor = await obj._getCache(user);
        reqDonor.setCity(message.body);
        await obj._updateCache(user, reqDonor);
    }

    async _askProvince(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Masukkan Nama Provinsi Pasien saat ini berada : ");
    }

    async _retrieveProvince(obj, user, message, sessionData){
        var reqDonor = await obj._getCache(user);
        reqDonor.setProvince(message.body);
        await obj._updateCache(user, reqDonor);
    }

    async _askBloodSackAmount(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Masukkan jumlah kantong darah yang dibutuhkan (1-10) : ");
    }
    
    async _retrieveBloodSackAmount(obj, user, message, sessionData){
        var amount = parseInt(message.body);
        if(isNaN(amount) || amount > 10 || amount <= 0){
            await obj._invalidInput(user, message, sessionData);
            return;
        }
        var reqDonor = await obj._getCache(user);
        reqDonor.setBloodSackAmount(amount);
        await obj._updateCache(user, reqDonor);
    }

    async _askContactPerson(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Masukkan Nama Orang yang dapat dihubungi : ");
    }

    async _retrieveContactPerson(obj, user, message, sessionData){
        var reqDonor = await obj._getCache(user);
        reqDonor.setContactPerson(message.body);
        await obj._updateCache(user, reqDonor);
    }

    async _askContactNumber(obj, user, message, sessionData){
        await obj.client.sendText(user.id, "Masukkan Nomor Handphone / Whatsapp yang dapat dihubungi : ");
    }

    async _retrieveContactNumber(obj, user, message, sessionData){
        var regExp = new RegExp("^0[0-9]*");
        var reqDonor = await obj._getCache(user);
        var inputNumber = message.body.replace(" ","").replace("-", "");
        if(!regExp.test(inputNumber)){
            await obj._invalidInput(user, message, sessionData);
            return;
        }
        reqDonor.setContactNumber(message.body);
        await obj._updateCache(user, reqDonor);
    }

    async _finalize(obj, user, message, sessionData){
        var reqDonor = await obj._getCache(user);
        await obj.dbRepository.saveDonorRequest(reqDonor);
        var message = `
        DIBUTUHKAN SEGERA DONOR PLASMA
        (minta tolong disebarkan sebanyak-banyak nya)

        GOLONGAN DARAH ${reqDonor.bloodType} 👈🏻

        PASIEN : ${reqDonor.name} ( ${reqDonor.age} thn ) 👈🏻
        KONDISI PASIEN : ${reqDonor.condition} 👈🏻
        RS : ${reqDonor.hospitalName} 👈🏻
        KOTA : ${reqDonor.city},${reqDonor.province} 👈🏻
        PERLU BERAPA KANTONG: ${reqDonor.bloodSackAmount} kantong 👈🏻

        Syarat Donor :
        - Usia 18-60 th
        - Berat badan minimal 55 KG
        - SUDAH LEWAT 14 HARI SEMBUH DARI COVID-19
        - Tidak mempunyai penyakit komorbid (jantung, diabetes, hipertensi, HIV dsb)
        - Belum pernah hamil

        CP :
        ${reqDonor.contactName} 👈🏻
        ${reqDonor.contactNumber} 👈🏻
        https://wa.me/62${reqDonor.contactNumber.substring(1)} 👈🏻

        didata & sebarkan oleh:
        KOMUNITAS
        MANTAN PASIEN COVID-19
        `;
        await obj.waRepository.send(message);
        await obj.client.sendText(user.id, "Request Donor telah terdaftar, selanjutnya tinggal menunggu pendonor akan menghubungi anda. Terima kasih.");
        sessionData.step = -1;
    }
}

module.exports = RequestDonorHandler;