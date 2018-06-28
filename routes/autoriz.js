const User = require('../models/userReg').User;
const Admin = require('../models/adminReg').Admin;
const DbGroup = require('../models/groupTovar').Group;
module.exports = function (app) {
    app.post('/autoriz', (req, res) => {
        let name = req.body.name,
            pass = req.body.pass;

        User.findOne({name: name}, function (err, curUser) {
            if(err) {
                res.render('message', {message: 'ошибка поиска в базе'});
                return;
            }
            if(curUser){
                if(curUser.checkPassword(pass)){
                    req.session.user = curUser._id;

                    res.redirect(303, '/' );
                }else {
                    res.render('message', {message: 'неверный пароль'});
                }
            }else {
                res.render('message', {message: 'нет такого пользователя'});
            }
        })

    });


    // ------------------------------------------------------//

    app.post('/autorizAdm', (req, res) => {
        let name = req.body.name,
            pass = req.body.pass;

        Admin.findOne({name: name}, function (err, admin) {
            if(err) {
                res.render('message', {message: 'Error log'});
                return;
            }
            if(admin){
                if(admin.checkPassword(pass)){
                    req.session.admin = admin._id;
                    DbGroup.find({}, function (err, groups) {
                        if (err) {
                            next(err);
                        }
                        User.find({mark: 'no'}, function (err, users) {
                            if(err) {next(err);}
                            res.locals.base = users;
                            res.render('./admin/main', {groups})
                        })
                    });
                }else {
                    res.render('message', {message: 'неверный пароль'});
                }
            }else {
                res.render('message', {message: 'неверный логин'});
            }
        })

    });


};
