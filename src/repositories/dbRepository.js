class DbRepository{
    constructor(connection){
        this.connection = connection;
    }
    async saveDonorRequest(reqDonor){
        /*var query = await this.connection.query(`
        INSERT INTO \`covid19service\`.\`donor_requests\`
            (\`name\`, \`age\`, \`bloodtype\`, \`condition\`, \`hospital\`, \`city\`, \`province\`, \`bloodsackamount\`, \`contactperson\`, \`contactnumber\`)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [reqDonor.name, reqDonor.age, reqDonor.bloodType,reqDonor.condition, reqDonor.hospitalName, reqDonor.city,reqDonor.province,reqDonor.bloodSackAmount, reqDonor.contactPerson, reqDonor.contactNumber], function (error, results, fields) {
        if (error) {
            console.error(error);
        }
        // Neat!
        });*/
        this.connection.query('INSERT INTO donor_requests SET ?', reqDonor, (err, res) => {
            if(err) console.error(err);
            else console.log('Inserted : ', res);
        })
    }
}

module.exports = DbRepository;