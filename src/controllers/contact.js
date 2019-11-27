"use strict";

// Imports
const Contact = require('../models/contact.model');
const {_200, _400, _401, _403, _404, _500} = require('../include');


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
            return res.status(403).json(_403('forbidden'));
        }

        console.log(req.query);
        const limit = req.query.limit;
        const offset = req.query.offset;

        Contact.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('_url', req.headers.host, Sequelize.col('photo')), 'photo_url']
                ]
            },
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
            return res.status(500).json(_500('unable to get contacts'));
        })
    },

    read: (req, res) => {
        if(!req.auth) {
            res.status(403).json(_403('forbidden'));
        }

        const id = req.params.id;

        Contact.findOne({
            attributes: {
                include: [
                    [Sequelize.fn('CONCAT', req.headers.host, Sequelize.col('photo')), 'photo_url']
                ]
            },
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
            return res.status(500).json(_500('unable to get contact'));
        })
    },

    create: (req, res) => {
        if(!req.auth) {
            return res.status(403).json(_403('forbidden'));
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
                return res.status(500).json(_500('contact already exists with this phone number'))
            }

            Contact.create({
                name,
                email,
                photo,
                telephone,
                user_id: req.auth.id
            })
            .then((inserted) => {
                return res.status(200).json({ userId: inserted.id });
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(_500('unable to create contact'));
        })
    },

    update: (req, res) => {        
        if(!req.auth) {
            res.status(403).json(_403('forbidden'));
        }
        
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
                return res.status(404).json(_404('contact not exists'));
            }

            result.update({
                name: name ? name : result.name,
                email: email ? email : result.email
            })            
            .then((updated) =>{
                return res.status(200).json({userId: updated.id});
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(_500('unable to verify contact'));
        })

    },

    delete: (req, res) => {
        if(!req.auth) {
            res.status(403).json(_403('forbidden'));
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
                return res.status(404).json(_404('contact not exists'));
            }

            result.destroy()           
            .then((deleted) =>{
                return res.status(200).json(_200('contact deleted successfuly'));
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(_500('unable to delete contact'));
        })

    },
}

const _url = (host, data) => {
    return host + '/' + data
}

const _validateCreate = (res, data) => {
    const name = data.name;
    const email = data.email;
    const telephone = data.telephone;

    if(name == null || email == null, telephone == null) {
        return res.status(400).json(_400('missing parameters'))
    }

    if(name.length < 3 || name.length > 50 ) {
        return res.status(400).json(_400('too short or too long name'));
    }

    if(!EMAIL_REGEX.test(email)) {
        return res.status(400).json(_400('email is incorrect'));
    }

    if(!PHONE_REGEX.test(telephone)) {
        return res.status(400).json(_400('telephone is incorrect'));
    }
}

const _validateUpdate = (res, data) => {
    const name = data.name;
    const email = data.email;

    if(name.length < 3 || name.length > 15 ) {
        return res.status(400).json(_400('too short or too long name'));
    }

    if(email.length > 0 && !EMAIL_REGEX.test(email)) {
        return res.status(400).json(_400('email is incorrect'));
    }
}