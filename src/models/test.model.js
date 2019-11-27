"use strict";

// Import
const { Model, DataTypes} = require('sequelize');
const sequelize = require('../core/db');

class Test extends Model {}

Test.init({
    username: DataTypes.STRING,
    birthday: DataTypes.DATE
}, { underscored: true, sequelize, modelName: 'test' });

module.exports = Test;
