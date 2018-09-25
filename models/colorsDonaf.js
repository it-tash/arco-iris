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
    size1:{
        type: Number,
        default: 0
    },
    size2:{
        type: Number,
        default: 0
    },
    size3:{
        type: Number,
        default: 0
    },
    size4:{
        type: Number,
        default: 0
    },
    size5:{
        type: Number,
        default: 0
    }

});


exports.DbColorsDonaf = db.model('DbColorsDonaf', schema);