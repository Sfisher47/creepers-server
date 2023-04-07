"use strict";

// Imports
const Sequelize = require('sequelize');
const Contact = require('../models/contact.model');
const User = require('../models/user.model');
const {_200, _500} = require('../include');


module.exports = {

    list: (req, res) => {

        const host = req.protocol + '://' + req.get('host') + '/uploads/';

        Contact.findAll({
            attributes: [
                'id',
				'name',
                'telephone', 
                'photo', 
                [Sequelize.fn('CONCAT', host, Sequelize.col('photo')), 'photo_url']
            ],
            include: {
                model: User, 
                attributes: ['id', 'name', 'telephone']
            }
        })
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log(err)
            return res.status(200).json(_500('unable to get data'));
        })
    },
}