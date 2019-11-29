"use strict";

// Imports
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const {_200, _400, _401, _403, _404, _500, genToken, isAdmin} = require('../include');


// Constantes
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;


module.exports = {
    
    schema: (req, res) => {
        res.status(200).json({
            name: "",
            email: "",
            telephone: "",
            password: ""
        });
    },

    //POST: users/login
    login: (req, res) => {

        // Recuperer les donnees
        const telephone = req.body.telephone;
        const password = req.body.password;

        // Verifier toutes les donnees
        if(telephone == null || password == null) {
            return res.status(200).json(_400('missing parameters'))
        }

        // Verifier si l'utilisateur est existant
        User.findOne({
            where: {telephone}
        })
        .then((user) => {
            if(!user) {
                return res.status(200).json(_403('user not exist'));
            }

            bcrypt.compare(password, user.password, (err, done) =>{
                if(!done) {
                    return res.status(200).json(_401('bad password'));
                }

                return res.status(200).json({
                    id: user.id, 
                    profil: user.profil, 
                    token: genToken(user)
                });                
            })

        })
    },

    //POST: users/register
    register: (req, res) => {

        // Recuperer les donnees
        const name = req.body.name;
        const email = req.body.email;
        const telephone = req.body.telephone;
        const password = req.body.password;

        // Verifier toutes les donnees
        _validateRegister(res, req.body);
        
        // Verifier si l'utilisateur est existant
        User.findOne({
            attributes: ['telephone'],
            where: {telephone}
        })
        .then((user) => {
            if(user) {
                return res.status(200).json(_500('user alrady exists'));
            }

            bcrypt.hash(password, 5, (err, hash) => {

                User.create({
                    name,
                    email,
                    telephone,
                    password: hash,
                })
                .then((inserted) => {
                    return res.status(200).json({ userId: inserted.id });
                })
                .catch((err)=>{
                    console.log(err);
                    return res.status(200).json(_500('unable to create user'));
                });
            });
        })
        .catch((err) =>{
            console.log(err);
            return res.status(200).json(_500('unable to verify user'));
        });
    },

    checkPhoneAvailable: (req, res) => {
        User.findOne({
            attributes: ['id'],
            where: {telephone: req.body.telephone}
        })
        .then(result => {
            if(!result) return res.status(200).json(_404('User::checkPhoneAvailable: not found'));
            return res.status(200).json({count: 1})
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('User::checkPhoneAvailable: unable to check phone'));
        })
    },

    getUser: (req, res) => {
        if(!req.auth) {
            return res.status(200).json(_401('Unauthorized'));
        }

        User.findOne({
            attributes: ['id', 'name', 'telephone', 'email'],
            where: {id: req.auth.id}
        })
        .then((user) => {
            return res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to verify user'));
        })
    },

    setUser: (req, res) => {
        if(!req.auth) {
            return res.status(200).json(_401('unauthorized'));
        }

        // Recuperer les donnees
        const name = req.body.name;
        const email = req.body.email;

        // Verifier toutes les donnees
        _validateSetUser(res, req.body);

        User.findOne({
            where: {id: req.auth.id}
        })
        .then((user) => {
            user.update({
                name: name ? name : user.name,
                email: email ? email : user.email
            })            
            .then((updated) =>{
                return res.status(200).json({userId: updated.id});
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to verify user'));
        })
    },
    
    list: (req, res) => {
        if(!req.auth || !isAdmin(req.auth.profil)) {
            res.status(200).json(_401('unauthorized'));
        }

        const limit = req.query.limit;
        const offset = req.query.offset;

        User.findAll({
            attributes: ['id', 'name', 'email', 'telephone'],
            limit: limit ? limit : 1000,
            offset: offset ? offset : 0,
        })
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to get users'));
        })
    },

    read: (req, res) => {
        if(!req.auth || !isAdmin(req.auth.profil)) {
            return res.status(200).json(_401('unauthorized'));
        }

        const id = req.params.id;

        User.findOne({
            attributes: ['id', 'name', 'email', 'telephone'],
            where: {
                id: id
            }
        })
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('unable to get users'));
        })
    },

    create: (req, res) => {
        if(!req.auth || !isAdmin(req.auth.profil)) {
            return res.status(200).json(_401('unauthorized'));
        }

        this.register(req, res);
    },

    update: (req, res) => {        
        if(!req.auth || !isAdmin(req.auth.profil)) {
            return res.status(200).json(_401('unauthorized'));
        }

        return res.status(200).json(_501('not implemented'));
    },

    delete: (req, res) => {
        if(!req.auth || !isAdmin(req.auth.profil)) {
            return res.status(200).json(_401('unauthorized'));
        }

        const id = req.params.id;

        User.findOne({
            where: {
                id: id,
            }
        })
        .then((user) => {
            if(!user) {
                return res.status(200).json(_404('user not exists'));
            }

            user.destroy()           
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

const _validateRegister = (res, data) => {
    const name = data.name;
    const email = data.email;
    const telephone = data.telephone;
    const password = data.password;

    if(name == null || email == null, telephone == null || password == null) {
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

const _validateSetUser = (res, data) => {
    const name = data.name;
    const email = data.email;

    if(name.length < 3 || name.length > 15 ) {
        return res.status(200).json(_400('too short or too long name'));
    }

    if(email.length > 0 && !EMAIL_REGEX.test(email)) {
        return res.status(200).json(_400('email is incorrect'));
    }
}