"use strict";

// Imports
const {Sequelize} = require('sequelize');
const path = require('path');

// Definir la base de donnees
// const db = new Sequelize('creepers', 'root', '', {
// host: 'localhost',
// dialect: 'mysql'
// });


const db = new Sequelize('creepers', 'root', 'root', {
dialect: 'sqlite',
storage: path.resolve(__dirname, '../../database/database.sqlite')
});

module.exports = db;