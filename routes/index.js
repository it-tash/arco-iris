
module.exports = function (app) {

    // вынести сюда все маршруты, а их тела подтягивать как модули

    require('./client')(app);
    require('./admin')(app);
    require('./autoriz')(app);
    require('./registr')(app);

};

