var express = require('express');
var cors = require('cors');

var router = require('./src/core/router');
var db = require('./src/core/db');
require('./src/bootstrap')();

// Definir l'application
var app = express();
app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('uploads'));

app.use('/api/v1', router);

// GET: /
router.get('/', (req, res) => {
    res.status(200).json({})
})

// Demarrer le serveur
app.listen(8000, () => {
    db.sync().then(() => { console.log('Connexion MySQL avec succes !') });
    console.log('Server listen http://localhost:8000 ...');
})