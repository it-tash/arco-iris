const db = require('mongoose');
db.connect('mongodb://localhost/arcoiris', {useMongoClient: true});// нужно переделать на config

exports.db = db;