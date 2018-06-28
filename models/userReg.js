const crypto = require('crypto');
const db = require('./config').db;
db.Promise = global.Promise;

const schemaUser = new db.Schema({
    name:{
        type: String,
        require: true,
        unique: true
    },
    telNo:{
        type: String,
        require: true,
    },
    town:{
        type: String
    },
    business:{
        type: String
    },
    email:{
        type: String,
        require: true,
    },
    viber:{
        type: Boolean,
    },
    date:{
        type: Date,
        default: Date.now
    },
    mark:{
        type: String
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
schemaUser
    .virtual('password')
    .set(function (data) {
        this.salt = String(Math.random());
        this.iteration = parseInt(Math.random()*10+1, 10);
        this.hash = this.getHash(data);
    })
    .get(function () {
        return this.hash;
    });
schemaUser.methods.getHash = function (password) {
    let c = crypto.createHmac('sha1', this.salt);
    for(let i=0; i < this.iteration; i++) {
        c = c.update(password);
    }
    return c.digest('hex');
};

schemaUser.methods.checkPassword = function (data) {
    return this.getHash(data) === this.hash;
};

exports.User = db.model('User', schemaUser);
