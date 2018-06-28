const fs = require('fs');

const DbImg = require('../models/cardTovar').DbImg;
const DbGroup = require('../models/groupTovar').Group;
const User = require('../models/userReg').User;
const Admin = require('../models/adminReg').Admin;
const DbCardText = require('../models/cardText').DbCardText;
const DbColors = require('../models/colors').DbColors;



module.exports = function (app) {

    app.get('/',  (req, res, next) => {
        if(req.session.user) {
            User.findById(req.session.user, function (err, user) {
                if (err) {
                    next(err);
                }
                res.render('client/index', {userName: user.name});
            })
        }else{
            // res.locals.userName = 'Гость';
            res.render('client/index');
        }
    });

    app.get('/cabinet', (req, res)=>{
        if(req.session.user) {
            User.findById(req.session.user, function (err, user) {
                if (err) {
                    next(err);
                }
                Admin.find({}, function (err, admin) {
                    if(admin.length>0) {
                        res.locals.adminButt = false;
                        res.locals.adminReg = false;
                        res.render('client/cabinet', {userName: user.name});
                    }else{
                        res.locals.adminButt = false;
                        res.locals.adminReg = true;
                        res.render('client/cabinet', {userName: user.name});
                    }
                })
            })
        }else if(req.session.admin){
            res.locals.adminButt = "/adminSession";
            res.locals.adminReg = false;
            res.render('client/cabinet', {userName: 'Admin'});
        }else{//Гость
            Admin.find({}, function (err, admin) {
                if(admin.length>0) {
                    res.locals.userName = 'Гость';
                    res.locals.adminButt = false;
                    res.locals.adminReg = false;

                    res.render('client/cabinet');
                }else{
                    res.locals.userName = 'Гость';
                    res.locals.adminButt = false;
                    res.locals.adminReg = true;

                    res.render('client/cabinet');
                }
            })
        }
    });

    app.get('/catalogDonafen', (req, res)=>{
        DbGroup.find({title: 'donafen'},
            function (err, groupDonafen) {
                if(groupDonafen.length>0) {
                    const idGroup = groupDonafen[0]._id.toString();
                    DbImg.find({idGroup: idGroup},
                        function (err, img) {
                                res.locals.img = img;
                                res.locals.catalogName = "Бюстгалтеры и комплекты Donafen";
                                //------------//
                                res.locals.leftArrowSrc = "img/arrSatLeft.png";
                                res.locals.leftArrowHref = "location.href='/catalogSatin'";
                                res.locals.leftArrowSpan = "в каталог Сатин";
          //------------------------------------//
                                res.locals.rightArrowSrc = "img/arrSwimRight.png";
                                res.locals.rightArrowHref = "location.href='/catalogSwimwears'";
                                res.locals.rightArrowSpan = "в каталог Купальники 2018";
                            //------session------//
                            if(req.session.user){
                                User.findById(req.session.user, function (err, user) {
                                    if(err) {next(err);}
                                    res.locals.userName = user.name;
                                    res.render('./client/catalog/main');
                                });
                            }else if(req.session.admin){
                                Admin.findById(req.session.admin, function (err, admin) {
                                    if(err) {next(err);}
                                    res.locals.userName = admin.name;
                                    res.render('./client/catalog/main');
                                });
                            }else {
                                res.locals.userName = 'Гость';
                                res.render('./client/catalog/main');
                            }
                            //------------//
                        })
                } else{console.log('no group donafen')}
            })
    });

    app.get('/catalogSwimwears', (req, res)=>{
        DbGroup.find({title: 'swimwears'},
            function (err, groupSwim) {//f

                if(groupSwim.length>0) {

                    const idGroup = groupSwim[0]._id.toString();
                    DbImg.find({idGroup: idGroup}, function (err, img) {
                        if (err) {
                            next(err);
                        }
                        res.locals.img = img;
                        res.locals.catalogName = "Купальники";

                        //------------//
                        res.locals.leftArrowSrc = "img/arrSatLeft.png";
                        res.locals.leftArrowHref = "location.href='/catalogSatin'";
                        res.locals.leftArrowSpan = "в каталог Arco-iris";
                        //------------------------------------//
                        res.locals.rightArrowSrc = "img/arrDonafRig.png";
                        res.locals.rightArrowHref = "location.href='/catalogDonafen'";
                        res.locals.rightArrowSpan = "в каталог Donafen";
                        //------session------//
                        if(req.session.user){
                            User.findById(req.session.user, function (err, user) {
                                if(err) {next(err);}
                                res.locals.userName = user.name;
                                res.render('./client/catalog/main');
                            });
                        }else if(req.session.admin){
                            Admin.findById(req.session.admin, function (err, admin) {
                                if(err) {next(err);}
                                res.locals.userName = admin.name;
                                res.render('./client/catalog/main');
                            });
                        }else {
                            res.locals.userName = 'Гость';
                            res.render('./client/catalog/main');
                        }
                        //------------//
                    });
                }else{console.log('no group swimwears')}

            })//f
    });

    app.get('/catalogSatin', (req, res)=>{
        DbGroup.find({title: 'satin'},
            function (err, groupSatin) {//f

                if(groupSatin.length>0) {

                    const idGroup = groupSatin[0]._id.toString();
                    DbImg.find({idGroup: idGroup, isMainImg: 'true'}, function (err, img) {
                        if (err) {
                            next(err);
                        }
                        res.locals.img = img;
                        res.locals.catalogName = "Изделия из сатина";

                        //------------//
                        res.locals.leftArrowSrc = "img/arrSwimLeft.png";
                        res.locals.leftArrowHref = "location.href='/catalogSwimwears'";
                        res.locals.leftArrowSpan = "в каталог Купальники";
                        //------------------------------------//
                        res.locals.rightArrowSrc = "img/arrDonafRig.png";
                        res.locals.rightArrowHref = "location.href='/catalogDonafen'";
                        res.locals.rightArrowSpan = "в каталог Donafen";
                        //------session-- ----//
                        if(req.session.user){
                            User.findById(req.session.user, function (err, user) {
                                if(err) {next(err);}
                                res.locals.userName = user.name;

                                res.render('./client/catalog/main');
                            });
                        }else if(req.session.admin){
                            Admin.findById(req.session.admin, function (err, admin) {
                                if(err) {next(err);}
                                res.locals.userName = admin.name;
                                res.render('./client/catalog/main');
                            });
                        }else {
                            res.locals.userName = 'Гость';

                            res.render('./client/catalog/main');
                        }
                        //------------//
                    })

                }else{console.log('no group satin')}

            })//f
    });

    app.get('/catalogBody', (req, res)=>{
        DbGroup.find({title: 'body'},
            function (err, groupBody) {//f

                if(groupBody.length>0) {

                    const idGroup = groupBody[0]._id.toString();
                    DbImg.find({idGroup: idGroup}, function (err, img) {
                        if (err) {
                            next(err);
                        }
                        res.locals.img = img;
                        res.locals.catalogName = "Боди";

                        //------------//
                        res.locals.leftArrowSrc = "img/arrSatLeft.png";
                        res.locals.leftArrowHref = "location.href='/catalogSatin'";
                        res.locals.leftArrowSpan = "в каталог Сатин";
                        //------------------------------------//
                        res.locals.rightArrowSrc = "img/arrTrikRight.png";
                        res.locals.rightArrowHref = "location.href='/catalogTrik'";
                        res.locals.rightArrowSpan = "в каталог Трикотаж";
                        //------session------//
                        if(req.session.user){
                            User.findById(req.session.user, function (err, user) {
                                if(err) {next(err);}
                                res.locals.userName = user.name;
                                res.render('./client/catalog/main');
                            });
                        }else if(req.session.admin){
                            Admin.findById(req.session.admin, function (err, admin) {
                                if(err) {next(err);}
                                res.locals.userName = admin.name;
                                res.render('./client/catalog/main');
                            });
                        }else {
                            res.locals.userName = 'Гость';
                            res.render('./client/catalog/main');
                        }
                        //------------//
                    })

                }else{console.log('no group Body')}

            })//f
    });

    app.get('/catalogTrik', (req, res)=>{
        DbGroup.find({title: 'trik'},
            function (err, groupTrik) {//f

                if(groupTrik.length>0) {

                    const idGroup = groupTrik[0]._id.toString();
                    DbImg.find({idGroup: idGroup}, function (err, img) {
                        if (err) {
                            next(err);
                        }
                        res.locals.img = img;
                        res.locals.catalogName = "Трикотаж";

                        //------------//
                        res.locals.leftArrowSrc = "img/arrBodyLeft.png";
                        res.locals.leftArrowHref = "location.href='/catalogBody'";
                        res.locals.leftArrowSpan = "в каталог Боди";
                        //---------------------------//
                        res.locals.rightArrowSrc = "img/arrowSatRigh.png";
                        res.locals.rightArrowHref = "location.href='/catalogSatin'";
                        res.locals.rightArrowSpan = "в каталог Сатин";
                        //------session------//
                        if(req.session.user){
                            User.findById(req.session.user, function (err, user) {
                                if(err) {next(err);}
                                res.locals.userName = user.name;
                                res.render('./client/catalog/main');
                            });
                        }else if(req.session.admin){
                            Admin.findById(req.session.admin, function (err, admin) {
                                if(err) {next(err);}
                                res.locals.userName = admin.name;
                                res.render('./client/catalog/main');
                            });
                        }else{
                            res.locals.userName = 'Гость';
                            res.render('./client/catalog/main');
                        }
                        //------------//
                    })

                }else{console.log('no group Trik')}

            })//f
    });

  
    // app.get('/openCardProduct/:idGroup/:artikul', async (req, res, next)=>{
    //     const text = await DbCardText.findOne({idGroup: String(req.params.idGroup), strictArtikul: String(req.params.artikul)}, function (err, textCardProduct) {
    //         if(err) {next(err);}
    //     })
    //     DbImg.find({idGroup: String(req.params.idGroup), strictArtikul: String(req.params.artikul)}, function (err, img) {
    //         if(err) {next(err);}
    //         res.locals.img = img;
            
    //         res.locals.textCard = text.text; 
    //         res.render('./client/cardProduct', {idGroup: String(req.params.id)})
    //     })
    // });

    app.get('/openCardProduct/:idGroup/:artikul', (req, res, next)=>{
        const idGroup = req.params.idGroup;
        const artikul = req.params.artikul;
        DbCardText.findOne({idGroup, strictArtikul: artikul}, function (err, textCard) {
            if(err) {next(err);}
            DbColors.find({idGroup, strictArtikul: artikul}, function (err, colors) {
                if(err) {next(err);}
                DbImg.find({idGroup, strictArtikul: artikul}, function (err, img) {
                    if(err) {next(err);}
                    res.locals.img = img;
                    (req.session.user || req.session.admin)? res.locals.access = 'true' : res.locals.access = 'false';
                    (textCard)?res.locals.textCard = textCard: res.locals.textCard = false;
                    res.locals.colors = colors;
                    res.render('./client/cardProduct', {idGroup, artikul})
                })
            })
        })
    });
    app.post(`/getOnchangeColorSizes`, (req, res, next)=>{
        const onchangedColor = req.body.onchangeColor;
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
       
        DbColors.find({idGroup: idGroup, strictArtikul: artikul, color: onchangedColor}, function (err, selectedcolor) {
            if(err) {next(err);}
            selectedcolor.map(obj=>{
                res.send(obj);
             });
        })
    })


        app.post(`/getFirstColorSizes`, (req, res, next)=>{
            const firstColor = req.body.firstColor;
            const idGroup = req.body.idGroup;
            const artikul = req.body.artikul;
                
            DbColors.find({idGroup: idGroup, strictArtikul: artikul, color: firstColor}, function (err, selectedcolor) {
                if(err) {next(err);}
                selectedcolor.map(obj=>{
                    res.send(obj);
                 });
            })
        })



};

