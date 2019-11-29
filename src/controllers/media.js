"use strict";

// Imports
const fs = require('fs');
const {_200, _500} = require('../include');


module.exports = {
    
    upload: (req, res) => {
        //console.log(`nouveau upload = ${req.file.filename}\n`);
        //console.log(req.file);
        const host = req.protocol + '://' + req.get('host') + '/';
        res.status(200).json({
            photo: req.file.filename,
            photo_url: host + req.file.filename
        });
    },

    delete: (req, res) => {
        const file = req.body.file;
        
        try {
            fs.unlinkSync('./uploads/' + file)
            //file removed
            res.status(200).json(_200('Media::delete: file removed successfuly'));
        } catch(err) {
            console.error(err);
            res.status(200).json(_500('Media::delete: unable to delete file'));
        }
    },
}