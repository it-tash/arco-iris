const db = require('./config').db;
db.Promise = global.Promise;

const schema = new db.Schema({

     text:{
        type: String,
        require: true
    },
    idGroup:{
        type: String,
        require: true,
    },
    price:{
        type: String,
    },
    strictArtikul: {
        type: String,
        require: true,
    }

});


exports.DbCardText = db.model('DbCardText', schema);