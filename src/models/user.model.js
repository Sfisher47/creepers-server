"use strict";

// Import
const { Model, DataTypes} = require('sequelize');
const sequelize = require('../core/db');

class User extends Model {}

User.init({
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
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
    },
    password: {
        type: DataTypes.STRING(100),
    },
    profil: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
    },
}, { underscored: true, sequelize, modelName: 'users' });

module.exports = User;
