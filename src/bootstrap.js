"use strict";

// Imports

module.exports = () => {

    const Test = require('./models/test.model');
    const User = require('./models/user.model');
    const Contact = require('./models/contact.model');
    const Trace = require('./models/trace.model');

    User.hasMany(Contact);
    Contact.belongsTo(User);
}