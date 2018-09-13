const db = require('./config').db;
db.Promise = global.Promise;

const schema = new db.Schema({
    userId:{
        type: String,
        require: true
    },
    fullOrderObj:{
        type: Object,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    complete:{
        type: String
    }
   

});


exports.FullOrder = db.model('FullOrder', schema);