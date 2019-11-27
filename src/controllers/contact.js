"use strict";

// Imports
const Sequelize = require('sequelize');
const Contact = require('../models/contact.model');
const {_200, _400, _401, _403, _404, _500} = require('../include');

// Constantes
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;


module.exports = {
    
    
    schema: (req, res) => {
        res.status(200).json({
            name: "",
            email: "",
            photo: "",
            telephone: ""
        });
    },

    list: (req, res) => {
        if(!req.auth) {
            return res.status(200).json(_401('unauthorized'));
        }

        console.log(req.query);
        const limit = req.query.limit;
        const offset = req.query.offset;

        const host = req.protocol + '://' + req.get('host') + '/';

        Contact.findAll({
            attributes: [
                'id', 'name', 'email', 'photo', 'telephone',
                [Sequelize.fn('CONCAT', host, Sequelize.col('photo')), 'photo_url']
            ],
            where: {
                user_id: req.auth.id,
            },
            limit: limit ? limit : 1000,
            offset: offset ? offset : 0,
        })
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to get contacts'));
        })
    },

    read: (req, res) => {
        if(!req.auth) {
            res.status(200).json(_401('unauthorized'));
        }

        const id = req.params.id;

        const host = req.protocol + '://' + req.get('host') + '/';

        Contact.findOne({
            attributes: [
                'id', 'name', 'email', 'photo', 'telephone',
                [Sequelize.fn('CONCAT', host, Sequelize.col('photo')), 'photo_url']
            ],
            where: {
                id: id,
                user_id: req.auth.id,
            }
        })
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to get contact'));
        })
    },

    create: (req, res) => {
        if(!req.auth) {
            return res.status(200).json(_401('unauthorized'));
        }        
         
        const name = req.body.name;
        const photo = req.body.photo;
        const email = req.body.email;
        const telephone = req.body.telephone;

        // Verifier toutes les donnees
        _validateCreate(res, req.body);

        Contact.findOne({
            where: {
                telephone,
                user_id: req.auth.id,
            }
        })
        .then(contact => {
            if(contact) {
                return res.status(200).json(_500('contact already exists with this phone number'))
            }

            Contact.create({
                name,
                email,
                photo,
                telephone
            })
            .then((inserted) => {
                inserted.setUser(req.auth.id);
                return res.status(200).json({ contactId: inserted.id });
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to create contact'));
        })
    },

    update: (req, res) => {        
        if(!req.auth) {
            res.status(200).json(_401('unauthorized'));
        }
        
        const name = req.body.name;
        const photo = req.body.photo;
        const email = req.body.email;

        // Verifier toutes les donnees
        _validateUpdate(res, req.body);

        const id = req.params.id;

        Contact.findOne({
            where: {
                id: id,
                user_id: req.auth.id,
            }
        })
        .then((result) => {            
            if(!result) {
                return res.status(200).json(_404('contact not exists'));
            }

            result.update({
                name: name ? name : result.name,
                email: email ? email : result.email,
                photo: photo ? photo : result.photo
            })            
            .then((updated) =>{
                return res.status(200).json({contactId: updated.id});
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to verify contact'));
        })

    },

    delete: (req, res) => {
        if(!req.auth) {
            res.status(200).json(_401('unauthorized'));
        }

        const id = req.params.id;

        Contact.findOne({
            where: {
                id: id,
                user_id: req.auth.id,
            }
        })
        .then((result) => {            
            if(!result) {
                return res.status(200).json(_404('contact not exists'));
            }

            result.destroy()           
            .then((deleted) =>{
                return res.status(200).json(_200('contact deleted successfuly'));
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to delete contact'));
        })

    },
}

const _validateCreate = (res, data) => {
    const name = data.name;
    const email = data.email;
    const telephone = data.telephone;

    if(name == null || email == null, telephone == null) {
        return res.status(200).json(_400('missing parameters'))
    }

    if(name.length < 3 || name.length > 50 ) {
        return res.status(200).json(_400('too short or too long name'));
    }

    if(!EMAIL_REGEX.test(email)) {
        return res.status(200).json(_400('email is incorrect'));
    }

    if(!PHONE_REGEX.test(telephone)) {
        return res.status(200).json(_400('telephone is incorrect'));
    }
}

const _validateUpdate = (res, data) => {
    const name = data.name;
    const email = data.email;

    if(name.length < 3 || name.length > 15 ) {
        return res.status(200).json(_400('too short or too long name'));
    }

    if(email.length > 0 && !EMAIL_REGEX.test(email)) {
        return res.status(200).json(_400('email is incorrect'));
    }
}