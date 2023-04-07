const express = require('express');
const cors = require('cors');

const router = require('./src/core/router');
const db = require('./src/core/db');
const User = require('./src/models/user.model');
require('./src/bootstrap')();

const usersController = require('./src/controllers/user');


// Definir l'application
var app = express();
app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/api/v1', router);

app.enable('trust proxy');

// GET: /
router.get('/', (req, res) => {
    res.status(200).json({})
})

// Demarrer le serveur
app.listen(8080, () => {
    db.sync().then(() => {
        User.findOne({
            attributes: ['id', 'name', 'telephone', 'email'],
            where: {name: 'admin'}
        }).then((user) => {
            if(!user) usersController.createAdmin();
        }).catch((err) => {
            console.log(err);
        })

        console.log('Connexion à la base de données avec succes !') 
    });
    console.log('Server listen http://localhost:8080 ...');
})