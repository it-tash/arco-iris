const crypto = require('crypto');
const db = require('./config').db;
db.Promise = global.Promise;

const schemaAdmin = new db.Schema({
    name:{
        type: String,
        require: true,
        unique: true
    },

    hash:{
        type: String,
        require: true
    },
    salt:{
        type: String,
        require: true
    },
    iteration:{
        type: Number,
        require: true
    },
    create:{
        type: Date,
        default: Date.now()
    }
});
schemaAdmin
    .virtual('password')
    .set(function (data) {
        this.salt = String(Math.random());
        this.iteration = parseInt(Math.random()*10+1, 10);
        this.hash = this.getHash(data);
    })
    .get(function () {
        return this.hash;
    });
schemaAdmin.methods.getHash = function (password) {
    let c = crypto.createHmac('sha1', this.salt);
    for(let i=0; i < this.iteration; i++) {
        c = c.update(password);
    }
    return c.digest('hex');
};

schemaAdmin.methods.checkPassword = function (data) {
    return this.getHash(data) === this.hash;
};

exports.Admin = db.model('Admin', schemaAdmin);
