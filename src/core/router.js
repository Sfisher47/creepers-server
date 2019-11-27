"use strict";

// Imports
const express = require('express');
const usersController = require('../controllers/user');
const contactsController = require('../controllers/contact');
const tracesController = require('../controllers/trace');
const mediasController = require('../controllers/media');
const {auth, upload} = require('../include');
const {trace} = require('../controllers/trace');



const router = express.Router();
router.use(trace);

// POST: usres/login
router.post('/users/login', usersController.login);

// POST: users/register
router.post('/users/register', usersController.register);

// GET: users/me
router.get('/users/me', auth, usersController.getUser);

// PUT: users/me
router.put('/users/me', auth, usersController.setUser);

// GET: users/list?limit=xxx&offset=xxx
router.get('/users', auth, usersController.list);

// GET: users/read
router.get('/users/:id', auth, usersController.read);

// POST: users/create
router.post('/users', auth, usersController.create);

// DELETE: users/delete
router.delete('/users/:id', auth, usersController.delete);


// GET: contacts/list?limit=xxx&offset=xxx
router.get('/contacts', auth, contactsController.list);

// GET: contacts/read
router.get('/contacts/:id', auth, contactsController.read);

// POST: contacts/create
router.post('/contacts', auth, contactsController.create);

// POST: contacts/update
router.put('/contacts/:id', auth, contactsController.update);

// DELETE: contacts/delete
router.delete('/contacts/:id', auth, contactsController.delete);


// GET: traces/list?limit=xxx&offset=xxx
router.get('/traces', auth, tracesController.list);

// GET: traces/read
router.get('/traces/:id', auth, tracesController.read);

// POST: traces/create
// router.post('/traces', auth, tracesController.create);

// DELETE: traces/delete
router.delete('/traces/:id', auth, tracesController.delete);


// POST: medias/upload
router.post('/medias/upload', upload.single('photo'), mediasController.upload);

// POST: traces/delete
router.post('/medias/delete', mediasController.delete);

module.exports = router;