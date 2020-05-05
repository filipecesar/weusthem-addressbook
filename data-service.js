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

var AddressBook = sequelize.define('AddressBook', {
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

var AddressBook = sequelize.define([
    'AddressBook',
    'dependency'
], function(require, factory) {
    'use strict';
    
});