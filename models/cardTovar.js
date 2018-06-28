const db = require('./config').db;
db.Promise = global.Promise;

const schema = new db.Schema({

     imgPath:{
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
    descriptImg:{
        type: String,
    },
    isMainImg: {
        type: String,
    },
    strictArtikul: {
        type: String,
        require: true,
    }

});


exports.DbImg = db.model('DbImg', schema);
