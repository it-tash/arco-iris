const db = require('./config').db;
db.Promise = global.Promise;

const schema = new db.Schema({

    color:{
        type: String,
        require: true
    },
    idGroup:{
        type: String,
        require: true,
    },
    strictArtikul: {
        type: String,
        require: true,
    },
    sizeS:{
        type: Number
    },
    sizeM:{
        type: Number
    },
    sizeL:{
        type: Number
    },
    sizeXL:{
        type: Number
    }

});


exports.DbColors = db.model('DbColors', schema);