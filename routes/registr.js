const User = require('../models/userReg').User;
const Admin = require('../models/adminReg').Admin;
module.exports = function (app) {
app.post('/registr', (req, res) => {
    let name = req.body.name,
        pass = req.body.pass,
        town = req.body.town,
        telNo = req.body.telNo,
        business = req.body.select,
        email = req.body.email,
        selectviber = req.body.selectvibername,
        viber;
        
        if (selectviber === 'Да'){
            viber = true;
       }else{
            viber = false;
       }

    // if (pass !== pass2) {
    //     res.render('message', {message: 'пароли не совпадают'});
    // }

    const userFilter = /^([а-яА-ЯёЁa-zA-Z0-9_\-])+$/;
    const userTown = /^([а-яА-ЯёЁa-zA-Z0-9_\- ])+$/;
    const userTel =  /^([z0-9])+$/;
    const passFilter = /^[а-яА-ЯёЁa-zA-Z0-9,!,%,&,@,#,$,\^,*,?,_,~,+]*$/;
    const emailFilter = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;


    if (!userFilter.test(name)) {
        res.render('message', {message: 'Опасный логин, не используйте пробелы и спецсимволы ! Разрешены все буквы и цифры русского и латинского алфавитов а также тире и нижнее подчеркивание. Проверте отсутствие пробелов перед и после логина.'});
    } else if(!passFilter.test(pass)){
        res.render('message', {message: 'Опасный пароль, не используйте пробелы ! Проверте отсутствие пробелов перед и после пароля.'});
    } else if(!emailFilter.test(email)){
        res.render('message', {message: 'Неверный формат email'});
    } else if(!userTown.test(town)){
        res.render('message', {message: 'Неверный формат поля "Город", не используйте спецсимволы ! Разрешены все буквы и цифры русского и латинского алфавитов а также тире и нижнее подчеркивание.'});
    } else if(!userTel.test(telNo)){
        res.render('message', {message: 'Неверный формат телефона'});
    } else {

        const client = new User({
            name: name,
            password: pass,
            telNo: telNo,
            town: town,
            business: business,
            email: email,
            viber:viber,
            mark: 'no'
        });
        client.save(function (err) {
            if (err) {
                (err.code === 11000) ? res.render('message', {message: 'пользователь с таким логином уже существует, попробуйте ещё'}) : res.render('message', {message: 'ошибка сохранения в базе'});
                console.dir(err);
            } else {
                req.session.user = client._id;
                res.locals.userName = client.name;
                res.render('client/gratitude');
            }
        });
    }
});

    app.post('/registrAdm', (req, res) => {

        Admin.find({}, function (err, admin) {
            if(admin.length>0) {
                // console.log(admin.length);
                res.render('message', {message: 'Error of reg'});
            }else{

        let name = req.body.name,
            pass = req.body.pass,
            pass2 = req.body.pass2;

        if (pass !== pass2) {
            res.render('message', {message: 'пароли не совпадают'});
        }

        const userFilter = /^([а-яА-ЯёЁa-zA-Z0-9_\-])+$/;
        const passFilter = /^[а-яА-ЯёЁa-zA-Z0-9,!,%,&,@,#,$,\^,*,?,_,~,+]*$/;
        if (!userFilter.test(name) || !passFilter.test(pass)) {
            res.render('message', {message: 'опасный логин или пароль, не используйте спецсимволы !'});
        } else {

            const root = new Admin({
                name: name,
                password: pass,
            });
            root.save(function (err) {
                if (err) {
                    (err.code === 11000) ? res.render('message', {message: 'такой пользователь(логин или email) уже существует, попробуйте ещё'}) : res.render('message', {message: 'ошибка сохранения в базе'});
                    console.dir(err);
                } else {
                    req.session.admin = root._id;
                    // res.locals.userName = 'Admin';
                    res.redirect(303, '/');
                }
            });
        }
            }//else admin.length > 0
        });//Admin.find
    });


};
