"use strict";

// Import
const { Model, DataTypes} = require('sequelize');
const sequelize = require('../core/db');

class Contact extends Model {}

Contact.init({
    id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
    },
    photo: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    
}, { underscored: true, sequelize, modelName: 'contacts' });

module.exports = Contact;