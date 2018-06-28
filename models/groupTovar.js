const db = require('./config').db;
db.Promise = global.Promise;

const schema = new db.Schema({

    title:{
        type: String,
        require: true,
        unique: true
    }

});


exports.Group = db.model('Group', schema);
