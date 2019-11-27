"use strict";

// FORMAT DU TOKEN
// Authorization: Bearer <access_token>

// Auth token
module.exports = (req, res, next) => {
    // Recuperer le l'authorisation du header
    const bearerHeader = req.headers['authorization'];

    // Tester si le bearer est undefined
    if(typeof bearerHeader === 'undefined') {
        // Forbidden
        res.json(_403('Forbidden'), 403);
    }
    
    // Extraire le token
    const bearer = bearerHeader.split(' ')[1];
    const token = bearer[1];

    // Extraire le payload
    const decoded = jwt.verify(token, 'secretkey');
    
    // Tester si le payload est undefined
    if(typeof decoded === 'undefined') {
        // Forbidden
        res.json(_403('Forbidden'), 403);
    }

    // Mettre le token et le paylaod dans la requete
    req.token = token;
    req.payload = decoded;
    
    // Appeler le middleware suivant
    next();
}