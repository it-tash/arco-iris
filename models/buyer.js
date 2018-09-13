const db = require('./config').db;
db.Promise = global.Promise;

const schemaBuyer = new db.Schema({
    userId:{
        type: String,
    },
    name:{
        type: String,
    },
    soname:{
        type: String,
    },
    telNo:{
        type: String,
    },
    town:{
        type: String
    },
    novPost:{
        type: String
    }
});

exports.Buyer = db.model('Buyer', schemaBuyer);
