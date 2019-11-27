"use strict";

// Import
const { Model, DataTypes} = require('sequelize');
const sequelize = require('../core/db');

class Trace extends Model {}

Trace.init({
    id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true
    },
    ip: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(50),
    },
    contry: {
        type: DataTypes.STRING(50),
    },
    continent: {
        type: DataTypes.STRING(50),
    },
    user_agent: {
        type: DataTypes.STRING(50),
    },
    latitude: {
        type: DataTypes.DOUBLE,
    },
    longitude: {
        type: DataTypes.DOUBLE,
    },
    
}, { underscored: true, sequelize, modelName: 'traces' });

module.exports = Trace;