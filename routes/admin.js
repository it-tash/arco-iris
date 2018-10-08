const fs = require("fs");
const im = require("imagemagick");

const DbImg = require('../models/cardTovar').DbImg;
const DbGroup = require('../models/groupTovar').Group;
const User = require('../models/userReg').User;
const DbCardText = require('../models/cardText').DbCardText;
const DbColors = require('../models/colors').DbColors;
const DbColorsDonaf = require('../models/colorsDonaf').DbColorsDonaf;
const DbFullOrder = require('../models/fullOrder').FullOrder;
const Buyer = require('../models/buyer').Buyer;
const Order = require('../models/order').Order;



module.exports = function (app) {

    app.get('/adminSession', (req, res, next)=>{
        if(req.session.admin) {
            DbGroup.find({}, function (err, groups) {
                if (err) {next(err);}

                User.find({mark: 'no'}, function (err, users) {
                    if(err) {next(err);}
                    res.render('./admin/main', {groups, base: users})
                })

            });
        }
    });

    app.get('/admLogOut', (req, res, next)=>{
        req.session.destroy(function(err) {
            if (err) {next(err);}
            res.redirect('/');
        });
    });

    app.get('/markUser/:id', (req, res, next)=>{
        if(req.session.admin){
            const userId = req.params.id;
            User.findByIdAndUpdate(userId, {mark: 'yes'}, function (err, user) {
                if(err) {next(err);}
                DbGroup.find({}, function (err, groups) {
                    if (err) {next(err);}
                    User.find({mark: 'no'}, function (err, users) {
                        if(err) {next(err);}
                        res.render('admin/main', {groups,base:users })
                    })
                })
            })
        }else {
            res.render('message', {message: 'Error of rights'});
        }
    });


    app.get('/basaUsers', (req, res, next)=>{
        if(req.session.admin){
            User.find({mark: 'yes'}, function (err, users) {
                if(err) {next(err);}
                res.render('./admin/basaUsers', {base:users})
            })
        }else{
            res.render('message', {message: 'Error of rights'});
        }
    });

    app.get('/delUser/:id', (req, res, next)=>{
        if(req.session.admin){
            const userId = req.params.id;
            User.findByIdAndRemove(userId, function (err, user) {
                if(err) {next(err);}
                User.find({mark: 'yes'}, function (err, users) {
                    if(err) {next(err);}
                    res.render('./admin/basaUsers', {base:users})
                })
            })
        }else{
            res.render('message', {message: 'Error of rights'});
        }
    });

    app.post('/images', (req, res, next) => {
        const idGroup = req.body.idGroup;
        const descriptImg = req.body.descriptImg;
        const strictArtikul = req.body.artikul;
        const isMainImg = req.body.isMainImg;

        const multerPath = req.files[0].path;

        const fileBuffer = fs.readFileSync(multerPath);
        const filePath = 'public/files/'+ Date.now()%100 + req.files[0].originalname ;

        function imResize(file, width, height, dest, callback){

            im.resize({
                srcPath: file,
                dstPath: dest,
                width: width,
                height: height
            }, function(err){
                if (err){
                    log.error('------ Error: ' + err);
                    callback(err);
                } else {
                    callback(null, "Success");
                }
            })
        }
 
        function imageMagic() {
            const maxSide = 500;
            const path = filePath;
            im.identify(path, function(err, features){
                if (err) { next(err);}

                // if ((features.width <= maxSide) && (features.height <= maxSide)){
                //
                //     callback(null, filelink);
                //
                // } else {

                const prop = features.width / features.height;
                const height = maxSide;
                const width = prop * features.height;

                // if (prop >=1){
                //     width = maxSide;
                //     height = prop * features.width;
                // }

                imResize(path, width, height, path, function(err){
                    if (err){next(err);}

                    im.convert([path, "-strip", "-interlace", "plane", "-quality", ""+ 75 +"%", path], function (err) {
                        if (err){ next(err);}
                            // callback(null, filelink);
                    })
                })
            })
        }

        fs.writeFile(filePath, fileBuffer, function(err){
            if (err){ next(err);}
                // Удаляем из public/uploads закачаный multer файл
                fs.stat(multerPath, function (err, stat) {
                    if(err === null) {  // while
                        fs.unlink(multerPath, function (err) {
                            if (err) { next(err);}
                                
                                imageMagic();

                                    const imgPath = filePath.substr(6); // путь к фотке без public/
                                    const Images = new DbImg({
                                        imgPath: imgPath,
                                        idGroup: idGroup,
                                        descriptImg: descriptImg,
                                        isMainImg: isMainImg,
                                        strictArtikul: strictArtikul
                                    });

                                    Images.save(function (err) {
                                        if (err) {
                                            console.dir(err);
                                        } else {
                                            console.dir('res.send');
                                            res.send('Success');

                                        }
                                    });
                        })
                    }
                }); 
        });

    });

   

    app.post('/validateArtikul', (req, res, next)=>{
        const strictArtikul = req.body.artikul;
        DbImg.findOne({strictArtikul, isMainImg: 'true'}, function (err, double) {
            if(err) {next(err);}
                if(double){
                    res.send('double')
                }else{
                    res.send('free')
                }
        });
    });


    app.get('/groupAdd', (req, res)=>{
        res.render('./admin/groupAdd')
    });

    app.post('/groupAdd', (req, res)=>{
        let groupTitle = req.body.title;
        const Group = new DbGroup({
            title: groupTitle
        });

        Group.save(function (err) {
            if (err) {
                console.dir(err);
            } else {
                res.render('ok');  //redirect
            }
        });
    });



    app.get('/cardAdd/:idGroup', (req, res, next)=>{
        const idGroup = req.params.idGroup;
        DbImg.find({idGroup, isMainImg: 'true'}, function (err, img) {
            if(err) {next(err);}
                res.locals.img = img;
                res.locals.includePage = 'mainImg';
                res.render('./admin/cardAdd', {idGroup})
        })
    });
 
    app.get('/openCard/:idGroup/:artikul', (req, res, next)=>{
        const idGroup = req.params.idGroup;
        const strictArtikul = req.params.artikul;
        DbImg.find({idGroup, strictArtikul}, function (err, img) {
            if(err) {next(err);}
            DbCardText.findOne({idGroup, strictArtikul}, function (err, textCard){
                if(err) {next(err);}
                DbGroup.findById(idGroup, function (err, group) {
                    if(err) {next(err);}
                    var aliasDbColor;
                    (group.title == 'donafen') ? aliasDbColor = DbColorsDonaf : aliasDbColor = DbColors;
                    aliasDbColor.find({idGroup, strictArtikul}, function (err, colors) {
                        if(err) {next(err);}
                       
                                res.locals.img = img;
                                res.locals.includePage = 'inCard';
                                (textCard)?res.locals.textCard = textCard: res.locals.textCard = false;
                                res.locals.colors = colors;
                                res.locals.titleGroup = group.title;
                            
                                res.render('./admin/cardAdd', {idGroup, artikul: strictArtikul})
                    })
                })
            })
        })
    });


    app.get('/delImg/:idImg/:idGroup', (req, res, next)=>{
        const idGroup = req.params.idGroup;
        DbImg.findByIdAndRemove(req.params.idImg, function (err, imgDel) {
            if(err) {next(err);}
            if(imgDel){
                const imgDelFulPath = "public" + imgDel.imgPath;
                fs.stat(imgDelFulPath, function (err, stat) {
                    if(err === null) {
                        fs.unlink(imgDelFulPath, function (err) {
                            if (err) {next(err);}
                                console.log("Удален товар: ", imgDelFulPath);
                                DbImg.find({idGroup, isMainImg: 'true'}, function (err, img) {
                                    if(err) {next(err);}
                                    res.locals.img = img;
                                    res.locals.includePage = 'mainImg';
                                    res.render('./admin/cardAdd', {idGroup})
                                })
                        })
                    }
                }); 
            }
           
        });


    });

    app.post(`/sendTextCard`, (req, res)=>{
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
        const descrCardText = req.body.descrCardText;
        const priceCardText = req.body.priceCardText;

        const CardText = new DbCardText({
            text: descrCardText,
            idGroup: idGroup,
            price: priceCardText,
            strictArtikul:artikul
         });

         CardText.save(function (err) {
            if (err) {next(err);}
            DbImg.findOneAndUpdate({idGroup, strictArtikul: artikul, isMainImg: 'true'},{price: priceCardText}, {new: true}, function (err, img) {
                if(err) {next(err);}
                res.send('text saved');
            }) 
        });
    })
    
    app.post( `/sendColorCard`, (req, res)=>{
        const idGroup = req.body.idGroup;
        const artikulColorCard = req.body.artikul;
        const colorCard = req.body.colorCard; 
        const sizeS = req.body.sizeS;
        const sizeM = req.body.sizeM;
        const sizeL = req.body.sizeL;
        const sizeXL = req.body.sizeXL;
        const sizeB1 = req.body.sizeB1;
        const sizeB2 = req.body.sizeB2;
        const sizeB3 = req.body.sizeB3;
        
        DbColors.find({idGroup, strictArtikul: artikulColorCard}, function(err, artikulCardsFound){
            if(err) {next(err);}
            let colorRepeat = false;
            if(artikulCardsFound){
                artikulCardsFound.map((oneCard)=>{
                    if(oneCard.color == colorCard){colorRepeat = true;}
                })
            }
            if(colorRepeat == false){
                const ColorCard = new DbColors({
                    color: colorCard,
                    idGroup: idGroup,
                    strictArtikul: artikulColorCard,
                    sizeS: sizeS,
                    sizeM:sizeM,
                    sizeL:sizeL,
                    sizeXL: sizeXL,
                    sizeB1: sizeB1,
                    sizeB2: sizeB2,
                    sizeB3: sizeB3
                });

                ColorCard.save(function (err) {
                    if (err) {
                        console.dir(err);
                    } else {
                        console.dir('color saved');
                        res.send('color saved');
                    }
                });
            }else{res.send('цвет уже существует');}
        });
    });

    app.post( `/sendDonafenColorCard`, (req, res)=>{
        const idGroup = req.body.idGroup;
        const artikulColorCard = req.body.artikul;
        const colorCard = req.body.colorCard; 
        const size1 = req.body.size1;
        const size2 = req.body.size2;
        const size3 = req.body.size3;
        const size4 = req.body.size4;
        const size5 = req.body.size5;

        DbColorsDonaf.find({idGroup, strictArtikul: artikulColorCard}, function(err, artikulCardsFound){
            if(err) {next(err);}
            let colorRepeat = false;
            if(artikulCardsFound){
                artikulCardsFound.map((oneCard)=>{
                    if(oneCard.color == colorCard){colorRepeat = true;}
                })
            }
            if(colorRepeat == false){
                const DonafColorCard = new DbColorsDonaf({
                    color: colorCard,
                    idGroup: idGroup,
                    strictArtikul: artikulColorCard,
                    size1: size1,
                    size2:size2,
                    size3:size3,
                    size4: size4,
                    size5: size5 
                });

                DonafColorCard.save(function (err) {
                    if (err) {
                        console.dir(err);
                    } else {
                        console.dir('color saved');
                        res.send('color saved');
                    }
                });
            }else{res.send('цвет уже существует');}
        });
    });

    // ------------------edit--------------------------

    app.post(`/sendEditTextCard`, (req, res, next)=>{
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
        const editTextCard = req.body.editTextCard;

         DbCardText.findOneAndUpdate({idGroup, strictArtikul: artikul},{text: editTextCard}, {new: true}, function (err, newTextCard) {
            if (err) {next(err);}
                res.send('edit success');
        });
    })

    app.post(`/sendEditPriceCard`, (req, res, next)=>{
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
        const priceCardText = req.body.priceCardText;

         DbCardText.findOneAndUpdate({idGroup, strictArtikul: artikul},{price: priceCardText}, {new: true}, function (err, newTextCard) {
            if (err) {next(err);}
            DbImg.findOneAndUpdate({idGroup, strictArtikul: artikul, isMainImg: 'true'},{price: priceCardText}, {new: true}, function (err, img) {
                if(err) {next(err);}
                res.send('edit success');
            })
        });
    })


    app.post(`/sendEditSizesCard`, (req, res, next)=>{
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
        const editingColor = req.body.editingColor;
        const s = req.body.edS;
        const m = req.body.edM;
        const l = req.body.edL;
        const xl = req.body.edXL;
        const b1 = req.body.edB1;
        const b2 = req.body.edB2;
        const b3 = req.body.edB3;

        DbColors.findOneAndUpdate({idGroup, color: editingColor, strictArtikul: artikul},{sizeS: s, sizeM: m, sizeL: l, sizeXL: xl, sizeB1: b1, sizeB2: b2, sizeB3: b3,}, {new: true}, function (err, newColorSizesCard) {
            if (err) {next(err);}
                res.send('edit success');
        });
    });
    
    app.post(`/sendEditSizesDonafen`, (req, res, next)=>{
        const idGroup = req.body.idGroup;
        const artikul = req.body.artikul;
        const editingColor = req.body.editingColor;
        const D1 = req.body.ed1;
        const D2 = req.body.ed2;
        const D3 = req.body.ed3;
        const D4 = req.body.ed4;
        const D5 = req.body.ed5;
        
        DbColorsDonaf.findOneAndUpdate({idGroup, color: editingColor, strictArtikul: artikul},{size1: D1, size2: D2, size3: D3, size4: D4, size5: D5}, {new: true}, function (err, newColorSizesCard) {
            if (err) {next(err);}
                res.send('edit success');
        });
    });

    app.post(`/delColor`, (req, res, next)=>{
        const idGroup = req.body.idGroup;
        const strictArtikul = req.body.artikul;
        const color = req.body.editingColor;
        
        DbGroup.findById(idGroup, function (err, group) {
            if(err) {next(err);}
            var AliasDbColor;
            (group.title == 'donafen') ? AliasDbColor = DbColorsDonaf : AliasDbColor = DbColors;
            AliasDbColor.findOneAndRemove({idGroup, color, strictArtikul}, function (err, deletedColor) {
                    if (err) {next(err);}
                    if(deletedColor){
                        res.send('delete success');
                    }
            });
        });
    });



    app.get(`/allOrdersInBasckets`, (req, res, next)=>{
       
        Order.find({}, function (err, orders) {
            if (err) {next(err);}
            const objUnicsIds = {};
            orders.map(order => {
                if(order.userId){ // admin order in bascket
                    const userId = order.userId;
                    objUnicsIds[userId] = true; // запомнить строку в виде свойства объекта
                }
            })
            unicUsersIds = Object.keys(objUnicsIds);
                res.render('./admin/allOrdersInBasckets', {unicUsersIds});
        });
    });


    app.post('/getBascketOfUser', (req, res, next)=>{
        const userId = req.body.userId;
        User.findById(userId, function (err, user) {
            if(err) {next(err);}
            Order.find({userId}, function (err, orders) {
                if(err) {next(err);}
                    res.send({user, orders});
            });
        });
    });

    app.post(`/cleanUserBascket`, (req, res, next)=>{
        const userId = req.body.userId;
        Order.find({userId}, function (err, orders) {
            if(err) {next(err);}
                orders.map(order=>{
                    orderId = order._id;
                    Order.findByIdAndRemove(orderId, function (err, delOrder){
                        if(err) {next(err);}
                        
                    })
                })
            res.send('del')  
        });
    });

    app.get(`/basaNewFullOrders`, (req, res, next)=>{
       
        DbFullOrder.find({complete: 'no'}, function (err, newfullOrders) {
            if (err) {next(err);}
                res.render('./admin/basaNewFullOrders', {newfullOrders});
            });
      
    });

    app.get(`/completeOrder/:id`, (req, res, next)=>{
        const fullOrderId = req.params.id;
        DbFullOrder.findByIdAndUpdate(fullOrderId, {complete: 'yes'}, function (err, fullOrder) {
                if(err) {next(err);}
                DbFullOrder.find({complete: 'no'}, function (err, newfullOrders) {
                    if (err) {next(err);}
                        res.render('./admin/basaNewFullOrders', {newfullOrders});
                });
           
        });
    });

    app.get(`/basaCompletedOrders`, (req, res, next)=>{
       
        DbFullOrder.find({complete: 'yes'}, function (err, newfullOrders) {
            if (err) {next(err);}
                res.render('./admin/basaCompletedOrders', {newfullOrders});
        });
    });
   
   

    app.post('/getUser', (req, res, next)=>{
        const userId = req.body.userId;
        User.findById(userId, function (err, user) {
            if(err) {next(err);}
            Buyer.findOne({userId}, function (err, buyer) {
                if(err) {next(err);}
                res.send({user, buyer});
            });
        });
    });

   




};

