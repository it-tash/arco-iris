const fs = require('fs');

const DbImg = require('../models/cardTovar').DbImg;
const DbGroup = require('../models/groupTovar').Group;
const User = require('../models/userReg').User;
const Admin = require('../models/adminReg').Admin;
const DbCardText = require('../models/cardText').DbCardText;
const DbColors = require('../models/colors').DbColors;
const DbColorsDonaf = require('../models/colorsDonaf').DbColorsDonaf;
const Order = require('../models/order').Order;
const DbFullOrder = require('../models/fullOrder').FullOrder;
const Buyer = require('../models/buyer').Buyer;



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
                    DbImg.find({idGroup, isMainImg: 'true'},
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
                                    (user) ? res.locals.userName = user.name : res.locals.userName = 'Гость';
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
                    DbImg.find({idGroup: idGroup, isMainImg: 'true'}, function (err, img) {
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
                                (user) ? res.locals.userName = user.name : res.locals.userName = 'Гость';
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
                                (user) ? res.locals.userName = user.name : res.locals.userName = 'Гость';
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
                    DbImg.find({idGroup: idGroup, isMainImg: 'true'}, function (err, img) {
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
                                (user) ? res.locals.userName = user.name : res.locals.userName = 'Гость';
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
                    DbImg.find({idGroup: idGroup, isMainImg: 'true'}, function (err, img) {
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
                                (user) ? res.locals.userName = user.name : res.locals.userName = 'Гость';
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
            DbGroup.findById(idGroup, function (err, group) {
                if(err) {next(err);}
                var aliasDbColor;
                (group.title == 'donafen') ? aliasDbColor = DbColorsDonaf : aliasDbColor = DbColors;
                aliasDbColor.find({idGroup, strictArtikul: artikul}, function (err, colors) {
                    if(err) {next(err);}
                    DbImg.find({idGroup, strictArtikul: artikul}, function (err, img) {
                        if(err) {next(err);}
                    
                        res.locals.img = img;
                        (req.session.user || req.session.admin)? res.locals.access = 'true' : res.locals.access = 'false';
                        (req.session.admin)? res.locals.adminSesion = 'true' : res.locals.adminSesion = 'false';
                        (textCard)?res.locals.textCard = textCard: res.locals.textCard = false;
                        res.locals.colors = colors;
                        // console.log(colors)
                        res.locals.titleGroup = group.title;
                        res.render('./client/cardProduct', {idGroup, artikul});
                    })
                })
            })
        })
    });
    app.post(`/getOnchangeColorSizes`, (req, res, next)=>{
        const onchangedColor = req.body.onchangeColor;
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
       
        DbColors.find({idGroup, strictArtikul: artikul, color: onchangedColor}, function (err, selectedcolor) {
            if(err) {next(err);}
            selectedcolor.map(obj=>{
                res.send(obj);
             });
        })
    })
    

    app.post(`/getOnchangeColorDonafen`, (req, res, next)=>{
        const onchangedColor = req.body.onchangeColor;
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
       
        DbColorsDonaf.find({idGroup, strictArtikul: artikul, color: onchangedColor}, function (err, selectedcolor) {
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
                
            DbColors.find({idGroup, strictArtikul: artikul, color: firstColor}, function (err, selectedcolor) {
                if(err) {next(err);}
                selectedcolor.map(obj=>{
                    res.send(obj);
                 });
            })
        });
       
        app.post(`/getFirstColorDonafen`, (req, res, next)=>{
            const firstColor = req.body.firstColor;
            const idGroup = req.body.idGroup;
            const artikul = req.body.artikul;
                
            DbColorsDonaf.find({idGroup, strictArtikul: artikul, color: firstColor}, function (err, selectedcolor) {
                if(err) {next(err);}
                selectedcolor.map(obj=>{
                    res.send(obj);
                 });
            })
        });

        app.post(`/putInBascket`, (req, res, next)=>{
            const userId = req.session.user;
            const idGroup = req.body.idGroup;
            const titleGroup = req.body.titleGroup;
            const artikul = req.body.artikul;
            const img = req.body.img;
            const colorOrder = req.body.colorOrder;
            const sInner = req.body.sInner;
            const mInner = req.body.mInner;
            const lInner = req.body.lInner;
            const xlInner = req.body.xlInner;
            const b1 = req.body.b1Inner;
            const b2 = req.body.b2Inner;
            const b3 = req.body.b3Inner;


            Order.findOne({userId, idGroup, strictArtikul: artikul, color: colorOrder}, function (err, orderDb) {
                if(err) {next(err);}
                    if(!orderDb){
                        const order = new Order({
                            userId: userId,
                            color: colorOrder,
                            idGroup: idGroup,
                            titleGroup: titleGroup,
                            strictArtikul: artikul,
                            img: img,
                            sizeS: sInner,
                            sizeM: mInner,
                            sizeL: lInner,
                            sizeXL: xlInner,
                            sizeB1: b1,
                            sizeB2: b2,
                            sizeB3: b3
                        });
                        order.save(function (err) {
                            if(err) {next(err);}
                                res.send('добавлено в заказ');
                        });
                    }else{
                        res.send('позиция уже существует, колличество можно добавить в корзине');
                    }
            });
        
        });

        
        app.post(`/putInBascketDonafen`, (req, res, next)=>{
            const userId = req.session.user;
            const idGroup = req.body.idGroup;
            const titleGroup = req.body.titleGroup;
            const artikul = req.body.artikul;
            const img = req.body.img;
            const colorOrder = req.body.colorOrder;
            const d1 = req.body.D1Inner;
            const d2 = req.body.D2Inner;
            const d3 = req.body.D3Inner;
            const d4 = req.body.D4Inner;
            const d5 = req.body.D5Inner;
            


            Order.findOne({userId, idGroup, strictArtikul: artikul, color: colorOrder}, function (err, orderDb) {
                if(err) {next(err);}
                    if(!orderDb){
                        const order = new Order({
                            userId: userId,
                            color: colorOrder,
                            idGroup: idGroup,
                            titleGroup: titleGroup,
                            strictArtikul: artikul,
                            img: img,
                            size1: d1,
                            size2: d2,
                            size3: d3,
                            size4: d4,
                            size5: d5
                        });
                        order.save(function (err) {
                            if(err) {next(err);}
                                res.send('добавлено в заказ');
                        });
                    }else{
                        res.send('позиция уже существует, колличество можно добавить в корзине');
                    }
            });
        
        });


        app.get('/bascket', (req, res, next)=>{
            if(req.session.user){
                Order.find({userId: req.session.user}, function (err, bascket) {
                    if(err) {next(err);}
                    User.findById(req.session.user, function (err, user) {
                        if(err) {next(err);}
                        Buyer.findOne({userId: req.session.user}, function (err, buyer) {
                            if(err) {next(err);}
                            res.locals.bascket = bascket;
                            buyer ? res.locals.buyerTel = buyer.telNo :  res.locals.buyerTel = user.telNo;
                            buyer ? res.locals.buyerTown = buyer.town :  res.locals.buyerTown = user.town;
                            buyer ? res.locals.buyerName = buyer.name : res.locals.buyerName = '';
                            buyer ? res.locals.buyerSoname = buyer.soname : res.locals.buyerSoname = '';
                            buyer ? res.locals.novPost = buyer.novPost : res.locals.novPost = '';
                            res.render('./client/bascket');
                        });
                     });
                });
            } else {
                res.render(('message'), {message: 'необходимо войти или зарегистрироваться'});
            }
        });

        app.post('/sendBuyerData', (req, res, next)=>{
            const userId = req.session.user;
            const buyerName = req.body.buyerName;
            const buyerSoname = req.body.buyerSoname;
            const buyerTel = req.body.buyerTel;
            const buyerTown = req.body.buyerTown;
            const novPost = req.body.novPost;
                
            Buyer.findOne({userId:req.session.user}, function (err, buyer) {
                if(!buyer){
                const buyer = new Buyer({
                    userId: userId,
                    name: buyerName,
                    soname: buyerSoname,
                    telNo: buyerTel,
                    town: buyerTown,
                    novPost: novPost
                });
                buyer.save(function (err) {
                    if(err) {next(err);}
                        res.send('данные записаны');
                });
                }else{
                    buyer.name = buyerName;
                    buyer.soname = buyerSoname;
                    buyer.telNo = buyerTel;
                    buyer.town = buyerTown;
                    buyer.novPost = novPost;

                    buyer.save(function (err) {
                        if(err) {next(err);}
                            res.send('данные перезаписаны');
                    });
                }
            });
           
        });  

    app.post('/getLatestBase', (req, res, next)=>{
        const color = req.body.color;
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
        const titleGroup = req.body.titleGroup;
        let AliasDb;

        (titleGroup != 'donafen') ? AliasDb =  DbColors : AliasDb = DbColorsDonaf;
            
        AliasDb.find({idGroup, strictArtikul: artikul, color}, function (err, base ) {
            if(err) {next(err);}
            DbCardText.findOne({idGroup, strictArtikul: artikul}, function (err, cardText) {
                if(err) {next(err);}
                const price = cardText.price;
                base.map(obj=>{
                    res.send({obj, price});
                });
            })

        })
       
    });

    app.post('/buy', (req, res, next)=>{
        
        const fullOrder = req.body._bascket;
       
        const fullDbOrder = new DbFullOrder({
            userId: req.session.user,
            fullOrderObj: fullOrder,
            complete: 'no'
        });
        fullDbOrder.save(function (err) {
            if(err) {next(err);}

            fullOrder.map(order => {
                const idGroup = order.idGroup;
                const titleGroup = order.titleGroup;
                const strictArtikul = order.strictArtikul;
                const color = order.color;
                let AliasDb;

                (titleGroup != 'donafen') ? AliasDb =  DbColors : AliasDb = DbColorsDonaf;

                AliasDb.findOne({idGroup, strictArtikul, color}, function (err, oldColor) {
                    if(err) {next(err);}

                    if(titleGroup != 'donafen'){                
                        const newSizeS = oldColor.sizeS - order.sizeS;
                        const newSizeM = oldColor.sizeM - order.sizeM;
                        const newSizeL = oldColor.sizeL - order.sizeL;
                        const newSizeXL = oldColor.sizeXL - order.sizeXL;
                        const newSizeB1 = oldColor.sizeB1 - order.sizeB1;
                        const newSizeB2 = oldColor.sizeB2 - order.sizeB2;
                        const newSizeB3 = oldColor.sizeB3 - order.sizeB3;
                        DbColors.findOneAndUpdate({idGroup, strictArtikul, color}, {sizeS: newSizeS, sizeM: newSizeM, sizeL: newSizeL, sizeXL: newSizeXL, sizeB1: newSizeB1, sizeB2: newSizeB2, sizeB3: newSizeB3}, {new: true}, function (err, newColor) {
                            if(err) {next(err);}

                            Order.findOneAndRemove({userId: req.session.user}, function (err, order) {
                                if(err) {next(err);}
                            });
                        });
                    }else{
                        const newSize1 = oldColor.size1 - order.size1;
                        const newSize2 = oldColor.size2 - order.size2;
                        const newSize3 = oldColor.size3 - order.size3;
                        const newSize4 = oldColor.size4 - order.size4;
                        const newSize5 = oldColor.size5 - order.size5;
                        DbColorsDonaf.findOneAndUpdate({idGroup, strictArtikul, color}, {size1: newSize1, size2: newSize2, size3: newSize3, size4: newSize4, size5: newSize5}, {new: true}, function (err, newColor) {
                            if(err) {next(err);}

                            Order.findOneAndRemove({userId: req.session.user}, function (err, order) {
                                if(err) {next(err);}

                            });
                            
                        });
                    }

                });
            });
            
            res.send('success')
        });
    });





};

