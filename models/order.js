const db = require('./config').db;
db.Promise = global.Promise;

const schema = new db.Schema({
    userId:{
        type: String,
        require: true
    },
    color:{
        type: String,
        require: true
    },
    img:{
        type: String,
        require: true
    },
    idGroup:{
        type: String,
        require: true,
    },
    titleGroup:{
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
    },
    size1:{
        type: Number,
        default: 0
    },
    size2:{
        type: Number,
        default: 0
    },size3:{
        type: Number,
        default: 0
    },size4:{
        type: Number,
        default: 0
    },size5:{
        type: Number,
        default: 0
    },
    date:{
        type: Date,
        default: Date.now
    },
    mark:{
        type: String
    }

});


exports.Order = db.model('Order', schema);