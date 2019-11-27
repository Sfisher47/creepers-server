"use strict";

// Imports
const {Sequelize} = require('sequelize');

// Definir la base de donnees
const db = new Sequelize('creepers', 'root', '', {
host: 'localhost',
dialect: 'mysql'
});

module.exports = db;