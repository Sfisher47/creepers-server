"use strict";

// Imports
var request = require('request');
const Trace = require('../models/trace.model');
const {_200, _400, _401, _403, _404, _500, isAdmin} = require('../include');


module.exports = {
    
    schema: (req, res) => {
        res.status(200).json({
            ip: "",
            date: "",
            city: "",
            contry: "",
            continent: "",
            user_agent: "",
            latitude: "",
            longitude: "",
        });
    },

    list: (req, res) => {
        if(!req.auth || !isAdmin(req.auth.profil)) {
            return res.status(200).json(_401('Trace::list: unauthorized'));
        }

        console.log(req.query);
        const limit = req.query.limit;
        const offset = req.query.offset;

        Trace.findAll({
            limit: limit ? limit : 1000,
            offset: offset ? offset : 0
        })
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('Trace::list: unable to get data'));
        })
    },

    read: (req, res) => {
        if(!req.auth || !isAdmin(req.auth.profil)) {
            return res.status(200).json(_401('Trace::read: unauthorized'));
        }

        const id = req.params.id;

        Trace.findOne({
            where: {
                id: id
            }
        })
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('Trace::read: unable to get data'));
        })
    },

    delete: (req, res) => {
        if(!req.auth || !isAdmin(req.auth.profil)) {
            res.status(200).json(_401('Trace::delete: unauthorized'));
        }

        const id = req.params.id;        

        Trace.findOne({
            where: {
                id: id
            }
        })
        .then((result) => {            
            if(!result) {
                return res.status(200).json(_404('Trace::delete: trace not exists'));
            }

            result.destroy()
            .then((deleted) =>{
                return res.status(200).json(_200('Trace::delete: deleted successfuly'));
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(200).json(_500('Trace::delete: unable to delete'));
        })

    },

    trace: (req, res, next) => {

        request(`https://www.iplocate.io/api/lookup/${req.ip}`, (error, response, body) => {
            //console.log('error:', error); // Print the error if one occurred
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            
            if(error) {
                //return res.status(500).json(_500('unable to create'));
                return next();
            }

            const data = JSON.parse(body);

            Trace.findOne({
                where: {
                    ip: data.ip,
                }
            })
            .then(result => {
                if(result) {
                    return next();
                }

                Trace.create({
                    ip: data.ip,
                    date: Date.now(),
                    city: data.city,
                    contry: data.country,
                    continent: data.continent,
                    user_agent: req.headers["user-agent"],
                    latitude: data.latitude,
                    longitude: data.longitude,
                })
                .then((inserted) => {
                    return next();
                })
                .catch((err)=>{
                    console.log(err);
                    return res.status(200).json(_500('@trace: unable to create'));
                });

                return next();
            })
            .catch(err => {
                console.log(err);
                return res.status(200).json(_500('@trace: unable to find data'));
            })
            
        });
        
    },
}