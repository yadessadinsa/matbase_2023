
/* MATBASE PROGRAMME SERVER EXPRESS + NODEJS + MONGODB
 APP DEPENDENCY
------------------------------------------------------*/

var express = require('express');
require('dotenv').config();
var app = express();

var path = require('path');

var EJS  = require('ejs');

//app.engine('html', EJS.renderFile);

// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index.js');
var users  = require('./routes/users.js');
//var datas = require('./views/data.ejs')
var project = require('./models/project.js');

var session = require('express-session');
var passport = require('passport');
var {check, validationResult} = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var multer = require('multer');
var upload = multer({ dest: './uploads' })
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var morgan = require('morgan');
const { Server } = require('http');
var expressLayouts = require('express-ejs-layouts');
const { connect } = require('http2');
const fs = require('fs')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


//process.env.MONGODB_URI ||



var connection =   'mongodb://localhost/Data_app' || process.env.MONGODB_URI 

mongoose.connect( connection  , {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true

    
});


   
mongoose.set('strictQuery', false);

/*const connectDB = async () => {
    try {
        await mongoose.connect(connection);
        console.log(`Mongodb is connected to: ${con.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}*/

mongoose.connection.on('open', function (ref) {
    console.log('Connected to database server.' + connection);
    
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names);
    });
    console.log('okay')
});

const PORT = process.env.PORT || 8080



/* VIEW ENGINE SETUP
-------------------------------------*/
app.use(morgan('dev'))
app.use(expressLayouts)

app.set('views',path.join(__dirname, 'views'));
//app.set('views',path.join(__dirname, 'views/partials'));

app.set('view engine', 'ejs');
app.set('layout', './layouts/Intro header')

const urlencodedParser = bodyParser.urlencoded({extended: false})
// uncomment afer placing your favicon in /;
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
/* SESSION HANDLER
---------------------------------------*/
 const oneDay = 1000 * 60 * 60 *24
app.use(session({
    secret: "thisismysession",
    cookie:{  maxAge: oneDay},
    saveUninitialized:false,
    resave: false
}));


// Passport middleware

app.use(passport.initialize());
app.use(passport.session());
/*app.use(expressValidator({
    errFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formparam = root;

        while (namespace.length) {
            formparam += '[' + namespace.shift()
        }
        return {
            param: formpram,
            msg: msg,
            value: value
        };
    }
}));*/
//app.use(LocalStrategy());
app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
       
   next();
});
 
 app.use('/', routes);
 app.use('/users', users);
 //app.use('/datas', datas)
 app.use(users);
 //app.use(datas)
 app.get('*', function( req, res, next){
    res.locals.success = req.flash('success');
    res.locals.info = req.flash('info');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


 /*  fetch data from mongodb database and parse to json format 
  ------------------------------------------------------------*/  

app.get('/fetchD', (req,res) =>{

    database.collection('datas').find({}).toArray((error, result) =>{
        if(error) throw error
        res.json({result})
    })
})

var database
app.listen(PORT, function (err) {

MongoClient.connect(url, {useNewUrlParser: true}, (error,result) =>{


    if (err) {
        throw error
        
    } else
        database = result.db('Data_app')
        console.log('connection to the mongoClient is made!!')
        console.log("The server is runnining successfuly to Port 8080")
        console.log(project)
})   

})

/*function convertJSon(data){
    
    const finished = (error) =>{
        if(error){
        console.error(error)
        return;
        }
    }

    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFile(database.json, jsonData, finished)
}

convertJSon(data)*/
 