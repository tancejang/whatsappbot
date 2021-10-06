const Cache = require('../cache/cache');
const Donor = require('../model/donor');
class RegisterDonorHandler {
    prefix = "REG_DONOR_";
    constructor(client){
        this.cache = new Cache();
        this.client = client;
    }

    async handle(sessionData, message){
        var user = sessionData.user;
        switch(sessionData.substep){
            case 0:
                await this._firstMenu(user);
                await this._askName(user);
                break;
            case 1:
                await this._retrieveName(user, message);
                await this._askGender(user);
                break;
            case 2:
                await this._retrieveGender(user, message, sessionData);
                await this._askAge(user);
                break;
        }
        sessionData.substep++;
    }

    async _updateCache(user, donor){
        this.cache.set(this.prefix + user.id, donor);
    }

    async _getCache(user){
        return this.cache.get(this.prefix + user.id);
    }

    async _invalidInput(sessionData){
        sessionData.substep-=2;
        await this.client.sendText(sessionData.user.id, "Mohon maaf namun input anda yang masukkan salah. Mohon inputkan kembali");
        return;
    }

    async _retrieveName(user, message){
        var name = message.body;
        var donor = new Donor();
        donor.setName(name);
        await this._updateCache(user, donor);
    }

    async _retrieveGender(user, message, sessionData){
        var input = parseInt(message.body);
        if(isNaN(input) || input > 2 || input <= 0){
            await this._invalidInput(sessionData);
            return;
        }
        var gender = input == 1 ? "L" : "P";
        var donor = await this._getCache(user);
        donor.setGender(gender);
        await this._updateCache(user, donor);
    }

    async _retrieveAge(user, message, sessionData){
        var input = parseInt(message.body);
        if(isNaN(input) || input > 99 || input <= 0){
            await this._invalidInput(sessionData);
            return;
        }
        if (input < 18 || input > 60){
            await this.client.sendText(user.id, "Mohon maaf, Pendonor harus berusia antara 18 hingga 60 tahun. Terima kasih.");
        }
        var gender = input == 1 ? "L" : "P";
        var donor = await this._getCache(user);
        donor.setGender(gender);
        await this._updateCache(user, donor);
    }

    async _firstMenu(user){
        await this.client.sendText(user.id, "Terimakasih telah berminat untuk menjadi pendonor plasma COVID-19. Tahap berikutnya adalah silahkan mengisi data anda.");
    }
    async _askName(user){
        await this.client.sendText(user.id, "Silahkan Masukkan Nama Lengkap : ");
    }

    async _askGender(user){
        await this.client.sendText(user.id, "Jenis Kelamin : \n 1. Pria \n 2. Wanita");
    }

    async _askAge(user){
        await this.client.sendText(user.id, "Silahkan Masukkan Usia Anda : ");
    }

    async _askWeight(user){
        await this.client.sendText(user.id, "Silahkan Masukkan Berat Badan Anda dalam Kg : ");
    }

    async _askWeight(user){
        await this.client.sendText(user.id, "Apakah Anda Pernah Hamil ? \n 1. Sudah Pernah Hamil \n 2. Belum Pernah Hamil");
    }

    async _askCity(user){
        await this.client.sendText(user.id, "Silahkan Masukkan Kota Anda sekarang berada : ");
    }

    async _askProvince(user){
        await this.client.sendText(user.id, "Silahkan Masukkan Provinsi Anda sekarang berada : ");
    }

    async _askBloodType(user){
        await this.client.sendText(user.id, "Silahkan masukkan golongan darah anda : \n 1. A \n 2. B \n 3. AB \n 4. O");
    }

    async _askRhesus(user){
        await this.client.sendText(user.id, "Silahkan masukkan golongan darah anda : \n 1. + \n 2. -");
    }

    async _askCuredDate(user){
        await this.client.sendText(user.id, "Silahkan masukkan tanggal anda sembuh dari Covid-19 (Tanggal PCR Negatif). format (01-12-2020): ");
    }

    async _askLastDonor(user){
        await this.client.sendText(user.id, "Silahkan masukkan tanggal anda terakhir melakukan donor plasma. format (01-12-2020): ");
    }
}

module.exports = RegisterDonorHandler;