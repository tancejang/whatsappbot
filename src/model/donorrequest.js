class DonorRequest {
    setBloodType(bloodType){
        this.bloodType = bloodType;
    }
    setName(name){
        this.name = name;
    }
    setAge(age){
        this.age = age;
    }
    setCondition(condition){
        this.condition = condition;
    }
    setHospital(hospitalName){
        this.hospitalName = hospitalName;
    }
    setCity(city){
        this.city = city;
    }
    setProvince(province){
        this.province = province;
    }
    setBloodSackAmount(bloodSackAmount){
        this.bloodSackAmount = bloodSackAmount;
    }
    setContactPerson(contactname){
        this.contactName = contactname; 
    }
    setContactNumber(contactnumber){
        this.contactNumber = contactnumber;
    }
}

module.exports = DonorRequest;