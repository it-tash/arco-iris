const http = require('http');
const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const favicon = require('express-favicon');

// const privateKey = fs.readFileSync('configure/credentials/private.key', 'utf8');
// const certificate = fs.readFileSync('configure/credentials/arco-iris_com_ua.crt', 'utf8');
// const credentials = {key: privateKey, cert: certificate};

const app = express();



app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(bodyParser.json()); // req.body axios

app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'некийкукисекрет'
}));



app.use(multer({dest: path.join(__dirname, 'public/uploads')}).any());

app.use(express.static(path.join(__dirname, 'public')));
    // app.use('/files', express.static('../files'));

app.use(favicon(__dirname + '/public/images/favicon.ico'));



    //************************* Routes ***********************************
    require('./routes')(app);

    //************************* 404 ***********************************
app.use((req, res, next) => {
    res.status(404);
    res.render('404');
});
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

    //************************* Запуск сервера ***********************************
    const httpServer = http.createServer(app);


    httpServer.listen(3000, '127.0.0.1', ()=>console.log('listening on 3000...'));

    // ------------------------------------------

    // const httpsServer = https.createServer(credentials, app);
    //
    //
    // httpsServer.listen(8443, '127.0.0.1', ()=>console.log('listening on 8443...'));




