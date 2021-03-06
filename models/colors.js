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
        type: Number,
        default: 0
    },
    sizeM:{
        type: Number,
        default: 0
    },
    sizeL:{
        type: Number,
        default: 0
    },
    sizeXL:{
        type: Number,
        default: 0
    },
    sizeB1:{
        type: Number,
        default: 0
    },
    sizeB2:{
        type: Number,
        default: 0
    },
    sizeB3:{
        type: Number,
        default: 0
    }

});


exports.DbColors = db.model('DbColors', schema);