"use strict";

// Imports
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'yaxW4jtC4rCJBrVY3JAmY6loEJIfW99D';

// Renvoyer une reponse json 200 OK
const _200 = function (message) {
    return {code: 200, message}
}

// Renvoyer une reponse json 400 Bad Request
const _400 = function (message) {
    return {code: 400, message}
}

// Renvoyer une reponse json 401 Unauthorized
const _401 = function (message) {
    return {code: 401, message}
}

// Renvoyer une reponse json 403 Forbidden
const _403 = function (message) {
    return {code: 403, message}
}

// Renvoyer une reponse json 404 Not Found
const _404 = function (message) {
    return {code: 404, message}
}

// Renvoyer une reponse json 500 Internal Server Error
const _500 = function (message) {
    return {code: 500, message}
}

const genToken = function (userData) {
    return jwt.sign({id: userData.id, profil: userData.profil}, JWT_SECRET_KEY);
}

const auth = function (req, res, next) {
    // Recuperer le l'authorisation du header
    const bearerHeader = req.headers['Authorization'];

    // Tester si le bearer est undefined
    if(typeof bearerHeader === 'undefined') {
        // Forbidden
        res.status(403).json(_403('Forbidden'));
    }
    
    // Extraire le token
    const bearer = bearerHeader.split(' ')[1];
    const token = bearer[1];

    // Extraire le payload
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    
    // Tester si le payload est undefined
    if(typeof decoded === 'undefined') {
        // Forbidden
        res.status(403).json(_403('Forbidden'));
    }

    // Mettre le token et le paylaod dans la requete
    req.token = token;
    req.auth = decoded;
    
    // Appeler le middleware suivant
    next();
}

module.exports = _200;
module.exports = _400;
module.exports = _401;
module.exports = _403;
module.exports = _404;
module.exports = _500;
module.exports = genToken;
module.exports = auth;