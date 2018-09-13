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