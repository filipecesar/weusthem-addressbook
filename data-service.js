const Sequelize = require('sequelize');
const {or, and, gt, lt} = Sequelize.Op;

//Setup sequelize to point to the postgres database

var sequelize = new Sequelize('judxxwmr', 'judxxwmr', 'wVLbRoeuqc-pGa5nOYfDN29W5yofQry3', {
    host: 'drona.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

var Contact = sequelize.define('Contact', {
    contactNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    phoneNumber: Sequelize.STRING
},{
    createdAt: false,
    updatedAt: false
});

module.exports.initialize = function (){
    return new Promise(function(resolve, reject){
        if (sequelize.sync().then(() => {
            resolve();
        }). catch(function(err) {
            reject("Unable to synchronize the database");
        }));
    });
}

module.exports.getAllContacts = function (){
    return new Promise(function(resolve, reject) {
        if(Contact.findAll() == 0 )
            reject("No results returned");
        else
            resolve(Contact.findAll());
    });
}

module.exports.getContactByNum = function(num) {
    return new Promise(function(resolve, reject){
        if(num > 0){
            Contact.findAll({
                where:{
                    contactNum : num
                }
            }).then((dataContact) =>{
                resolve(dataContact[0]);
            })
            .catch(function(Error){
            });
        } else {
            reject("Contact not found");
        }
    });
}

module.exports.addContact = (contactData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let x in contactData){
                if (contactData[x] == ""){
                    contactData[x] = null;
                }
            }
            Contact.create({
                contactNum: contactData.contactNum,
                firstName: contactData.firstName,
                lastName: contactData.lastName,
                email: contactData.email,
                phoneNumber: contactData.phoneNumber
            }).then(()=>{
                resolve();
            }).catch((err) => {
                reject("Contact not created");
            });
        }).catch(() => {
            reject("Contact not created");
    });
});
}

module.exports.updatedContact = (contactData) => {
    return new Promise((resolve, reject) => {
        for (let x in contactData) {
            if (contactData[x] == ""){
                contactData[x] = null
            }
        }
        resolve(Contact.update({
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phoneNumber: contactData.phoneNumber
        }, { where: {
            contactNum: contactData.contactNum
        }}));
        }).catch(() => {
            reject("Contact not updated");
        });
}

module.exports.deleteContactByNum = (num) =>{
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Contact.destroy({
                where:{
                    contactNum: num
                }}));
            }).catch((err) => {
                reject();
            });
    });
}