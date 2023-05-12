var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser')
var {check, validationResult} = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var data = require('../models/data.js');


//console.log(projects)

var dataStatus = require('../controller/dataStatus.js')
var flash = require('connect-flash');
const project = require('../models/project.js');

const urlencodedParser = bodyParser.urlencoded({extended: false})
/* ABOUT ROUTER MAIN PAGE
------------------------------------------------*/
router.get('/about', function (req, res, next) {
    res.render('First headerxx', { layout:'./layouts/intro header'})
})

/* ABOUT ROUTER DATAS
------------------------------------------------*/
router.get('/aboutD', function (req, res, next) {
    res.render('First headerxx', { layout:'./layouts/datas header'})
})

/* AUTHENTICATION ROUTES
   SIGN UP PAGES
------------------------------------------------*/ 
router.get('/register', function (req, res) {
    res.render('register.ejs' )
})
const validationCeck = [ 
// form validator
check('email', 'Email field is required')
.exists(),
check('email', 'Email is not valid')
.isEmail()
.normalizeEmail(),

check('username', 'Username field is required')
.exists()
.isLength({min:4, max: 8}),
/*check('password','Please enter a password at least 8 character and should contain at least one uppercase, at least one lower case and at least one special character.')
.isLength({ min: 8 })
.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),*/

check('password', 'The password must be 5+ chars long and contain a number')
     .isLength({min:5, max: 8}),
    
        
    check('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation is incorrect');
        }
        return true;
    })

/*check("password")
.notEmpty().withMessage("Password should not be empty"),
check("confirmPassword")
.notEmpty().withMessage("Confirm Password should not be empty")
.custom((value,{req}) =>{
    if(value !== req.body.password){
        throw new Error('Password confirmation does not match with password')
        }
    return true;
    
}),
/*check('password2', 'You need to conform your password!')
.exists({checkFalsy: true}),
check('password2', 'Passwords do not match!')
.equals('password'),*/

]
router.post('/register', urlencodedParser, validationCeck, function (req, res) {
// check errors
const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
        req.flash('error', error.msg)
        })
       var messages =  req.flash()
       res.render('register', {messages, layout: './layouts/intro header'})
          return
}else{
    var newUser = new User()
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.password2 = req.body.password2;
    newUser.Logo = req.body.Logo;
};
    User.create(newUser, function(err, user){
         //newuser.save(function (err, savedUser) {
        if (err) throw err;
            console.log(user)
            return res.status(500).send()
             
        });
            req.flash('success','You are now registered and authorized to login!')
            //res.location('/login')
            res.redirect('/login')
    })
  /*LOGIN RENDERING PAGE
--------------------------------------*/
const validationLoginCeck = [ 
    // form validator
    check('password', 'password is incorrect')
    .exists(),
]
    
router.get('/login', validationLoginCeck, function (req, res) {
    var UserName = req.flash('name')
    res.render('login', {UserName, layout:'./layouts/intro header'})
}) 
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}
 /*PASSPORT AUTHENTICATION METHOD
   FOR LOGIN TO THE DATABASE SYSTEM
----------------------------------------*/   
        //passport.use(new LocalStrategy(User.authenticate())); 

       passport.use(User.createStrategy());
        
        passport.use(new LocalStrategy(User.authenticate(),
              // function of username, password, done(callback)
            function(username, password, done) {
                // look for the user data
              User.findOne({ 
                username: username,
            
                              
            }, function (err, user) {
                // This is how you handel error
                if (err) { return done(err); }
                // when user is not found 
                if (!user) { return done(null, false), {message: 'user not found!'} }
                // when password is not correct
                
                if (!user.authenticate(password)) { return done(null, false), {message: 'Incorrect password!'} }
                // when all things are correct, we return the user
                return done(null, user);
              });
            }
        ));

          /*passport.use(new LocalStrategy(
            function(username, password, done) {
              User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (!user.verifyPassword(password)) { return done(null, false); }
                return done(null, user);
              });
            }
          ));*/


      passport.serializeUser(User.serializeUser());
          passport.deserializeUser(User.deserializeUser());
  

    router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash:('danger','Invalid passcode!!' )}),
  function(req, res) {
    
    req.flash('success', req.body.username + '      ' + 'you are now succefully logged in to the program!');
    res.redirect('/intro');
  });
/* LOGIN REDIRECTED TO INTRO PAGE
   MIDDLEWARE
----------------------------------------*/    
router.get('/intro', function (req, res) {
    res.render('intro' ,{message:req.flash(), layout: './layouts/introAb header'});
})
/* LOGIN LOGIC
   MIDDLEWARE
----------------------------------------*/

/*router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;    
User.findOne({ username: username, password: password }, function (err, user) {
        if (err) {
            console.log(err)
            return res.status(500).send()
        }
        if (!user) {
            return res.status(404).send()
            req.flash('danger', 'wrong username or password !!')
        }else
           res.redirect('/datas')
           return res.status(200).send()
    })
})*/
/* LOGOUT PAGE
------------------------------------------*/ 
router.get('/logout', function (req, res) {
    //req.logout();
    req.flash('success', 'You are now logged out!!')
    res.redirect('/');
})


 /*LOGINDATA RENDERING PAGE
--------------------------------------*/
router.get('/loginD', function (req, res) {
    var UserName = req.flash('name')
    res.render('loginData.ejs', {UserName, layout:'./layouts/datas header'})
}) 
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/loginD');
    }
}
 /*PASSPORT AUTHENTICATION METHOD
   FOR LOGINDATA TO THE DATABASE SYSTEM
----------------------------------------*/   
        passport.use(new LocalStrategy(User.authenticate())); 
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
        passport.use(new LocalStrategy(function(username, password, done) {
              User.findOne({ 
                username: username 
            }, function (err, user) {
                // This is how you handel error
                if (err) { return done(err); }
                // when user is not found 
                if (!user) { return done(null, false); }
                // when password is not correct
                if (!user.authenticate(password)) { return done(null, false); }
                // when all things are correct, we return the user
                return done(null, user);
              });
            }
          ));
    router.post('/loginD', passport.authenticate('local', { failureRedirect: '/loginD', failureFlash:('danger','Invalid username or pssword!!' )}),
  function(req, res) {
    req.flash('success', 'Welcome' + '   ' + req.body.username + '      ' + 'you are authorised to view, add or change the data!');
    res.redirect('/Data');
  });

   /*LOGINEDITDATA RENDERING PAGE
--------------------------------------*/
router.get('/loginEdit', function (req, res) {
    var UserName = req.flash('name')
    res.render('loginEdit.ejs', {UserName, layout:'./layouts/datas header'})
}) 
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/loginEdit');
    }
}


/*PASSPORT AUTHENTICATION METHOD
   FOR LOGINDATA TO THE DATABASE SYSTEM
----------------------------------------*/   
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(function(username, password, done) {
      User.findOne({ 
        username: username 
    }, function (err, user) {
        // This is how you handel error
        if (err) { return done(err); }
        // when user is not found 
        if (!user) { return done(null, false); }
        // when password is not correct
        if (!user.authenticate(password)) { return done(null, false); }
        // when all things are correct, we return the user
        return done(null, user);
      });
    }
  ));
router.post('/loginEdit', passport.authenticate('local', { failureRedirect: '/loginEdit', failureFlash:('danger','Invalid passcode!!' )}),
function(req, res) {
req.flash('success', 'Welcome' + '   ' + req.body.username + '      ' + 'you are authorised to Edit the data!');
res.redirect('/editdata');
});



router.get('/close', (req, res) => {
    res.status(200)
    res.end()
    
      server.close()
    }
)

/* RETRIEVES ALL DATA FROM THE DATABASE DATA
-------------------------------------------------*/
var pipelineSrt = [
    {
        '$match': {
           },
      },    
                    {
                       '$sort': {
                           'Date': -1
                          }
                        },
                        {
                            "$group" : {
                                "_id" : "$filltype",
                                'Project':{
                                    '$first': '$PrjNm'
                                },
                                "Plan" : {
                                    "$sum" : "$TotExc"
                                }
                                
                            }
                        }
                     
                   ]
router.get("/datas", ensureAuthenticated,  function (req, res) {



      data.find({"Quantity":{$gt:0}}, { "stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1, "approval":1,"supervisor":1,"comment":1,"Compaction": 1}, function (err, datas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            var messages =  req.flash()                    
            res.render("datas.ejs", {datas: datas, messages, layout: './layouts/datas header'});
            console.log("All the datas are retrieved from the database")
        }
    }).sort({Date:-1})
})
router.get("/Editdata", ensureAuthenticated, function (req, res) {
    data.find({"Quantity":{$gt:0}}, {"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1, "approval":1, "supervisor":1,"comment":1}, function (err, Editdata) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            var messages =  req.flash()                    
            res.render("Editdata.ejs", {Editdata: Editdata, messages, layout: './layouts/datas header'});
            console.log("All the datas are retrieved from the database")
        }
    }).sort({PrjNm: 1})
})


        const validationBodyTest = [
        
        
        
        
        
                   ] 

    router.post('/addproject', validationBodyTest, (req,res) => {

        
// check errors
const errors = validationResult(req);
             
if(!errors.isEmpty()){
    errors.array().forEach(error => {
    req.flash('error', error.msg)
   
   })
   req.flash('error', 'Project name duplucation!');
   res.redirect('/datas')
      return
}else 
        project.create(
           {
                   Project1: req.body.Project1,
                   

                   
                   TotExc: "",
                   stationF: req.body.stationF,
                   stationT: "",
                   filltype: "",
                   layerno: "",
                   thickness:"",
                   Quantity: "",
                   approval: "",
                   supervisor: "",
                   Date: "",
                   comment: "",
                   picture: "",
                   profile: "",
                   layerIm: "",
                   Rwidth: "",
                   shrnk: "",
                   BPname: "",
                   Evolume: "",
                   MatCol: "",
                   MatLyr: "",
                   Unitrate: "",
                   PrjNm: req.body.PrjNm,
                   PrjTyp:{
                    Actvity: "",
                    UnitMsr:"",
                    Unitrate:"",
                   
                   }
            
           }
        )
        req.flash('success', 'You have succesfuly inserted your projects!');
        console.log('The Project name is inserted succesfuly!')
        res.redirect('/project')
    })   

    /* open data pages based on form selection criterion [req.param] */

    router.get('/Data', function(req, res) {
        // here we have project or activity in req.params.data
        if(req.body.data == 'project') {
            res.render('prodataPr', {layout: './layouts/datas header'});
        } else if (req.body.data == 'activity') {
            res.render('prodataAC', {layout: './layouts/datas header'});
        } 
                
    });

    router.post('/Data', function(req, res) {
        // here we have project or activity in req.params.data
        if(req.body.data == 'project') {
            res.render('prodataPr', {layout: './layouts/datas header'});
        } else if (req.body.data == 'activity') {
            res.render('prodataAC', {layout: './layouts/datas header'});
        } 
                
    });

    /* return page to loginD
------------------------------------------*/ 
router.get('/back', function (req, res) {
    //req.logout();
    
    res.render('loginData', {layout: './layouts/datas header'});
})



router.get('/project', (req,res) => {
    data.find(function (err, prodataPr) {
        if (err) {
           
            console.log("You have an error")
            console.log(err)
        } else {
            
              
            var messages =  req.flash()                    
            res.render("prodataPr.ejs", {prodataPr: prodataPr, messages, layout:'./layouts/datas header'});
            

            console.log("All the datas are retrieved from the database")
            
        }
    })
})

router.get('/activity', (req,res) => {
    data.find(function (err, prodataAc) {
        if (err) {
           
            console.log("You have an error")
            console.log(err)
        } else {
            
              
            var messages =  req.flash()                    
            res.render("prodataAc.ejs", {prodataAc: prodataAc, messages, layout:'./layouts/datas header'});
            

            console.log("All the datas are retrieved from the database")
            
        }
    })
})

        
        
        
   
   
  
const validationBodyRules = [
    // form validator
    
   check('PrjNm')
    .not()
    .isEmpty()
    .withMessage('Project name is not inserted properly!')
    .custom((value, { req }) => {
        if (value !== req.body.PrjNm) {
          throw new Error('Project name is not inserted properly!');
        }
        return true;

    }),

   check('filltype')
    .not()
    .isEmpty()
    .withMessage('Activity type should be specified!!'),

   check('Quantity')
    .not()
    .isEmpty()
    .withMessage('Quantity executed should be specified!!'),

    check('supervisor')
    .not()
    .isEmpty()
    .withMessage('The supervisor name should be specified!!'),
    



  
   ] 
   router.post("/addata",  urlencodedParser, validationBodyRules, (req , res) => {

      const errors = validationResult(req);
       if(!errors.isEmpty()){ 
         errors.array().forEach(error => {
         req.flash  ('error', error.msg)
         })
         res.render('datasVald', {messages: req.flash(), layout: './layouts/datas header'})
          return
    }
        function dateInpute() {
            var d = new Date();
            var D = d.getDate();
            var M = d.getMonth();
            var Y = d.getFullYear();
            var date = D + "/" + M + "/" + Y;
            return date;
        }
        var Ln = req.body.layerno;
        if (Ln === "1") {
            var Ppic = "MatPic/Ll1.png";
        }
        else if (Ln === "2") {
            Ppic = "MatPic/Ll2.png";
        }
        else if (Ln === "3") {
            Ppic = "MatPic/Ll3.png";
        }
        else if (Ln === "4") {
            Ppic = "MatPic/Ll4.png";
        }
        else if (Ln === "5") {
            Ppic = "MatPic/Ll5.png";
        }
        else if (Ln === "6") {
            Ppic = "MatPic/Ll6.png";
        }
        else if (Ln === "7") {
            Ppic = "MatPic/Ll7.png";
        }
        else if (Ln === "8") {
            Ppic = "MatPic/Ll8.png";
        }
        else if (Ln === "9") {
            Ppic = "MatPic/Ll9.png";
        }
        else if (Ln === "10") {
            Ppic = "MatPic/Ll10.png";
        }
        else if (Ln === "11") {
            Ppic = "MatPic/lL11.png";
        }
        else if (Ln === "12") {
            Ppic = "MatPic/Ll12.png";
        }
        else if (Ln === "13") {
            Ppic = "MatPic/LL13.png";
        }
        else if (Ln === "14") {
            Ppic = "MatPic/Ll14.png";
        }
        else {
            Ppic = "MatPic/Ll15.png"
        }
        function layer() {
            var StT = req.body.stationF
            var Lno = req.body.layerno
            if (StT >= 20 && Lno === "1") {
                Lim = "MatPic/pic1.jpg"
            } else if (StT >= 20 && Lno === "2") {
                Lim = "MatPic/piC2.jpg"
            } else if (StT >= 20 && Lno === "3") {
                Lim = "MatPic/piC3.jpg"
            } else if (StT >= 20 && Lno === "4") {
                Lim = "MatPic/piC4.jpg"
            } else if (StT >= 20 && Lno === "5") {
                Lim = "MatPic/piC5.jpg"
            } else {
                Lim = "MatPic/pi6.jpg"
            }
            return Lim;
        }
        function volume() {
            V = ((req.body.stationT - req.body.stationF));
            return V;
        }
           volume()
        console.log(volume())
       // (req.body.Rwidth) * (req.body.thickness) * (req.body.shrinkage(req.body.Rwidth) * (req.body.thickness) * (req.body.shrinkage


        var P = req.body.picture;
        if (P) {
            P = req.body.picture;
        } else {
            P = "000.png";
        };

	/*//GET DATA FROM LOCAL STORGE PROJECT NAME
	const projects =    JSON.parse(localStorage.getItem('projects'))  
	const projectmap =  projects.map(i=> i.projectName)
	//GET DATA FROM LOCAL STORGE ACTIVITY NAMES
	const activities =    JSON.parse(localStorage.getItem('activities'))  
	const activitytmap =  activities.map(i=> i.activityName)*/

   

    // Color match with fill type
        if (req.body.filltype === "activitymap") {
             Col = "A";
        }
         else if (req.body.filltype === "activitymap") {
             Col = "B";
        }
        else if (req.body.filltype === "activitymap") {
            Col = "C";
        }
        else if (req.body.filltype === "activitymap") {
           Col = "D";
        }
        else if (req.body.filltype === "activitymap") {
            Col = "E";
        }
         else {
           Col = "F";
        }
        // Thickness match with fill layer number 
        if (req.body.layerno === "1") {
            Lyr = "L1";
       }
        else if (req.body.layerno === "2") {
            Lyr = "L2";
       }
       else if (req.body.layerno === "3") {
           Lyr = "L3";
       }
       else if (req.body.layerno === "4") {
          Lyr = "L4";
       }
       else if (req.body.layerno === "5") {
           Lyr = "L5";
       }
        else {
          Lyr = "L6";
       }

       



        // convert databas number to standar format
    /*  Project name match with wtith input from select button 
      ---------------------------------------------------------*/  
       data.create({
                   TotExc: req.body.TotExc,
                stationF: req.body.stationF,
                   stationT: req.body.stationT,
                   filltype: req.body.filltype,
                   layerno: req.body.layerno,
                   Compaction: req.body.Compaction,
                   Quantity: req.body.Quantity,
                   approval: req.body.approval,
                   supervisor: req.body.supervisor,
                   Date: dateInpute(),
                   comment: req.body.comment,
                   picture: P,
                   profile: Ppic,
                   layerIm: layer(),
                   Rwidth: req.body.Rwidth,
                   shrnk: req.body.shrnk,
                   shrinkage: req.body.shrinkage,
                   BPname: req.body.BPname,
                   Evolume: volume(),
                   MatCol: Col,
                   MatLyr: Lyr,
                   Unitrate: req.body.Unitrate,
                   PrjNm: req.body.PrjNm,
                   PrjTyp:{
                    Actvity: req.body.Activity,
                    UnitMsr:req.body.UnitMsr,
                    Unitrate:req.body.Unitrate
                },
                }
            )
            req.flash('success', 'You have succesfuly inserted your data!');
            res.redirect('/datas')
            }
 )

 const Addatas2 = [
    // form validator
    check('PrjNm')
    .not()
    .isEmpty()
    .withMessage('Project name is not inserted properly!'),
    
   check('filltype')
    .not()
    .isEmpty()
    .withMessage('Activity type should be specified!!'),

    check('TotExc')
    .not()
    .isEmpty()
    .withMessage('This activity is missing Plan Quantity!!'),

    check('shrnk')
    .not()
    .isEmpty()
    .withMessage('This activity is missing unit rate!!'),
 
] 

 router.post("/addatas2req", Addatas2,  urlencodedParser, (req , res) => {
    const errors = validationResult(req);
       if(!errors.isEmpty()){ 
         errors.array().forEach(error => {
         req.flash  ('error', error.msg)
         })
         res.render('datas2Vald', {messages: req.flash(), layout: './layouts/datas header'})
          return
    }
        function dateInpute() {
            var d = new Date();
            var D = d.getDate();
            var M = d.getMonth();
            var Y = d.getFullYear();
            var date = D + "/" + M + "/" + Y;
            return date;
        }
        var Ln = req.body.layerno;
        if (Ln === "1") {
            var Ppic = "MatPic/img1.jpg";
        }
        else if (Ln === "2") {
            Ppic = "MatPic/img2.jpg";
        }
        else if (Ln === "3") {
            Ppic = "MatPic/img3.jpg";
        }
        else if (Ln === "4") {
            Ppic = "MatPic/img4.jpg";
        }
        else {
            Ppic = "MatPic/img5.jpg"
        }
        function layer() {
            var StT = req.body.stationF
            var Lno = req.body.layerno
            if (StT >= 20 && Lno === "1") {
                Lim = "MatPic/pic1.jpg"
            } else if (StT >= 20 && Lno === "2") {
                Lim = "MatPic/piC2.jpg"
            } else if (StT >= 20 && Lno === "3") {
                Lim = "MatPic/piC3.jpg"
            } else if (StT >= 20 && Lno === "4") {
                Lim = "MatPic/piC4.jpg"
            } else if (StT >= 20 && Lno === "5") {
                Lim = "MatPic/piC5.jpg"
            } else {
                Lim = "MatPic/pi6.jpg"
            }
            return Lim;
        }
        function volume() {
            V = ((req.body.stationT - req.body.stationF) * (req.body.Rwidth) * (req.body.thickness) * (req.body.sh));
            return V;
        }
        
        



        var P = req.body.picture;
        if (P) {
            P = req.body.picture;
        } else {
            P = "000.jpg";
        };

	/*//GET DATA FROM LOCAL STORGE PROJECT NAME
	const projects =    JSON.parse(localStorage.getItem('projects'))  
	const projectmap =  projects.map(i=> i.projectName)
	//GET DATA FROM LOCAL STORGE ACTIVITY NAMES
	const activities =    JSON.parse(localStorage.getItem('activities'))  
	const activitytmap =  activities.map(i=> i.activityName)*/

   

    // Color match with fill type
        if (req.body.filltype === "activitymap") {
             Col = "A";
        }
         else if (req.body.filltype === "activitymap") {
             Col = "B";
        }
        else if (req.body.filltype === "activitymap") {
            Col = "C";
        }
        else if (req.body.filltype === "activitymap") {
           Col = "D";
        }
        else if (req.body.filltype === "activitymap") {
            Col = "E";
        }
         else {
           Col = "F";
        }
        // Thickness match with fill layer number 
        if (req.body.layerno === "1") {
            Lyr = "L1";
       }
        else if (req.body.layerno === "2") {
            Lyr = "L2";
       }
       else if (req.body.layerno === "3") {
           Lyr = "L3";
       }
       else if (req.body.layerno === "4") {
          Lyr = "L4";
       }
       else if (req.body.layerno === "5") {
           Lyr = "L5";
       }
        else {
          Lyr = "L6";
       }

       



        // convert databas number to standar format
    /*  Project name match with wtith input from select button 
      ---------------------------------------------------------*/  
       data.create({
                   TotExc: req.body.TotExc,
                   stationF: req.body.stationF,
                   stationT: req.body.stationT,
                   filltype: req.body.filltype,
                   layerno: req.body.layerno,
                   thickness: req.body.thickness,
                   Quantity: req.body.Quantity,
                   approval: req.body.approval,
                   supervisor: req.body.supervisor,
                   Date: dateInpute(),
                   comment: req.body.comment,
                   picture: P,
                   profile: Ppic,
                   layerIm: layer(),
                   Rwidth: req.body.Rwidt,
                   shrnk: req.body.shrnk,
                   sh: req.body.sh,
                   BPname: req.body.BPname,
                   Evolume: volume(),
                   MatCol: Col,
                   MatLyr: Lyr,
                   Unitrate: req.body.Unitrate,
                   PrjNm: req.body.PrjNm,
                   PrjTyp:{
                    Actvity: req.body.Activity,
                    UnitMsr:req.body.UnitMsr,
                    Unitrate:req.body.Unitrate
                },
                }
            )
            req.flash('success', 'You have succesfuly inserted your data!');
            res.redirect('/addatas2')
            }
 )
/* RENDER ACTIVITY SUMMARY PAGE
------------------------------------------*/
router.post("/datas1", urlencodedParser, validationBodyRules, function (req, res) {
        var pipelineI = [
            {
                "$unwind" : {
                    "path" : "$PrjNm"
                }
            }, 
            {
                "$match" : {
                    PrjNm: req.body.PrjNm ,
                }
            }, 
            {
                "$group" : {
                    "_id" : "$filltype",
                    "Project" : {
                        "$first" : "$PrjNm"
                    },
                    "Exec" : {
                        "$sum" : "$Quantity"
                    },
                    "Plan" : {
                        "$sum" : "$TotExc"
                    },
                    "UR" : {
                        "$sum" : "$shrnk"
                    }
                }
            }, 
            {
                "$project" : {
                    "UR" : 1.0,
                    "Project" : 1.0,
                    "Exec" : 1.0,
                    "Plan" : 1.0,
                    "RemQuan" : {
                        "$subtract" : [
                            "$Plan",
                            "$Exec"
                        ]
                    },
                    "Progress" : {
                        "$divide" : [
                            "$Exec",
                            "$Plan"
                        ]
                    }
                }
            }, 
            {
                "$project" : {
                    "UR" : 1.0,
                    "Project" : 1.0,
                    "Exec" : 1.0,
                    "Plan" : 1.0,
                    "RemQuan" : 1.0,
                    "Progress" : 1.0,
                    "ProgressM" : {
                        "$multiply" : [
                            "$Progress",
                            100.0
                        ]
                    }
                }
            }, 
            {
                "$project" : {
                    "UR" : 1.0,
                    "Project" : 1.0,
                    "Exec" : 1.0,
                    "Plan" : 1.0,
                    "RemQuan" : 1.0,
                    "Progress" : 1.0,
                    "ProgressR" : {
                        "$round" : [
                            "$ProgressM",
                            2.0
                        ]
                    },
                    "Amount" : {
                        "$multiply" : [
                            "$Exec",
                            "$UR"
                        ]
                    }
                }
            }
        ] 
    data.aggregate(pipelineI, function (err, datas1) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("datas1.ejs", { datas1: datas1, layout: './layouts/datas header' });
            console.log("A summary page is retrieved from the database");
        }
    })
})
/* RENDER ACTIVITY SUMMARY PAGE
------------------------------------------*/
router.get("/datas1", function (req, res) {
    var pipelineI = [
        {
            "$unwind" : {
                "path" : "$PrjNm"
            }
        }, 
        {
            "$match" : {
                PrjNm: req.body.PrjNm ,
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                "Project" : {
                    "$first" : "$PrjNm"
                },
                "Exec" : {
                    "$sum" : "$Quantity"
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : {
                    "$subtract" : [
                        "$Plan",
                        "$Exec"
                    ]
                },
                "Progress" : {
                    "$divide" : [
                        "$Exec",
                        "$Plan"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressM" : {
                    "$multiply" : [
                        "$Progress",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressR" : {
                    "$round" : [
                        "$ProgressM",
                        2.0
                    ]
                },
                "Amount" : {
                    "$multiply" : [
                        "$Exec",
                        "$UR"
                    ]
                }
            }
        }
    ] 
data.aggregate(pipelineI, function (err, datas1) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
        res.render("datas1.ejs", { datas1: datas1, layout: './layouts/datas header' });
        console.log("A summary page is retrieved from the database");
    }
})
})
 /* RETRIEVES ALL DATA FROM THE DATABASE DATA PER PROJECT
-------------------------------------------------*/
var pipelineSrt = [
    {
      '$sort': {
          'Date': -1
         }
    }
  ]
    router.post("/findPrjdata", function (req, res) {
    var thePrjNm = req.body.PrjNm;
    data.find({ PrjNm: thePrjNm,"Quantity":{$gt:0}},{"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1,"supervisor":1,}, function (err, Editdata) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("Editdata.ejs", { Editdata: Editdata, layout: './layouts/datas header' });
            console.log("Project data is retrieved from the database");
        }
    })
})
/* RETRIEVES PLAN DATA FROM THE DATABASE DATA
-------------------------------------------------*/
router.get("/datas2", ensureAuthenticated, function (req, res) {
    var pipelineA =    [
        {
            "$match" : {
                "PrjNm" : req.body.PrjNm,
            }    
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                'Project':{
                    '$first': '$PrjNm'
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }
    ]
    data.aggregate(pipelineA, function (err, datas2) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            var messages = req.flash()
            res.render("datas2.ejs", { datas2: datas2, messages, layout: './layouts/datas header' });
            console.log("All Plan quantity datas are retrieved from the database")
        }
    })
})
/* RETRIEVES PLAN DATA FROM THE DATABASE DATA
-------------------------------------------------*/

router.post("/datas2req", ensureAuthenticated, function (req, res) {
    var pipelineA =    [
        {
            "$unwind" : {
                "path" : "$PrjNm"
            }
        }, 
        {
            "$match" : {
                PrjNm: req.body.PrjNm ,
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                'Project':{
                    '$first': '$PrjNm'
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }
    ]
    data.aggregate(pipelineA, function (err, datas2) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            var messages = req.flash()
            //res.redirect("datas2req")
            res.render("datas2.ejs", { datas2: datas2, messages, layout: './layouts/datas header' });
            console.log("All Plan quantity datas are retrieved from the database")
        }
    })
})

/* RETRIEVES PLAN DATA FROM THE DATABASE DATA
-------------------------------------------------*/
router.get("/datas2req", ensureAuthenticated, function (req, res) {
    var pipelineA =    [
        {
            "$unwind" : {
                "path" : "$PrjNm"
            }
        }, 
        {
            "$match" : {
                "PrjNm" : req.body.PrjNm,
                
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                'Project':{
                    '$first': '$PrjNm'
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }
    ]
    data.aggregate(pipelineA, function (err, datas2) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            var messages = req.flash()
            //res,redirect("datas2")
            res.render("datas2.ejs", { datas2: datas2, messages, layout: './layouts/datas header' });
            console.log("All Plan quantity datas are retrieved from the database")
        }
    })
})

router.get("/EditPlan", ensureAuthenticated, function (req, res) {
    var pipelineA =    [
        {
            "$match" : {
                "PrjNm" : req.body.PrjNm,
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                'Project':{
                    '$first': '$PrjNm'
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }
    ]
    data.aggregate(pipelineA, function (err, EditPlan) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            var messages =  req.flash()                  
            res.render("EditPlan.ejs", {EditPlan: EditPlan, messages, layout: './layouts/datas header'});
            console.log("All the datas are retrieved from the database")
        }
    })
})
const validationAddatas2 = [
    // form validator
    /*check('Project')
    .not()
    .isEmpty()
    .withMessage('Project name is not inserted properly!')
    .custom((value, { req }) => {
        if (value !== req.body.PrjNm) {
          throw new Error('Project name is not inserted properly!');
        }
        return true;

    }),

   /*check('filltype')
    .not()
    .isEmpty()
    .withMessage('Activity type should be specified!!'),
 */
] 
router.post("/addatas2", validationAddatas2, ensureAuthenticated, function (req, res) {
    const errors = validationResult(req);
       if(!errors.isEmpty()){ 
         errors.array().forEach(error => {
         req.flash  ('error:', error.msg)
         })
         res.render('datas2Vald', {messages: req.flash(), layout: './layouts/datas header'})
          return
    }
    var pipelineA =    [
        {
            "$match" : {
                "PrjNm" : req.body.PrjNm,
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                'Project':{
                    '$first': '$PrjNm'
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }
    ]
    data.aggregate( pipelineA, function (err, datas2) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            req.flash('success', 'You have successfuly entered the Plan data.');
            //res.render("datas2.ejs", { datas2: datas2, message: req.flash(), layout: './layouts/datas header' })
           res.redirect('/datas2req')
        }
    })
})

 
router.get("/addatas2", validationAddatas2, ensureAuthenticated, function (req, res) {
    const errors = validationResult(req);
       if(!errors.isEmpty()){ 
         errors.array().forEach(error => {
         req.flash  ('Error:', error.msg)
         })
         res.render('datas2Vald', {messages: req.flash(), layout: './layouts/datas header'})
          return
    }
    var pipelineA =    [
        {
            "$match" : {
                "PrjNm" : req.body.PrjNm,
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                'Project':{
                    '$first': '$PrjNm'
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }
    ]
    data.aggregate( pipelineA, function (err, datas2) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            req.flash('success', 'You have successfuly entered the Plan data.');
            res.render("datas2.ejs", { datas2: datas2, message: req.flash(), layout: './layouts/datas header' })
            //res.redirect('/datas2req')
        }
    })
})

/* RENDER TOTAL SUMMARY REPORT PAGE
------------------------------------------*/

const Addatas3 = [
    // form validator
    check('Plan')
    .not()
    .isEmpty()
    .withMessage('The activities plan schedule is incomplete!!'),
 
]

router.post("/datas3", function (req, res) {

    const errors = validationResult(req);
    if(!errors.isEmpty()){ 
      errors.array().forEach(error => {
      req.flash  ('error:', error.msg)
      })
      res.render('datas2Vald', {messages: req.flash(), layout: './layouts/datas header'})
       return
 }

    var  pipelineIII =  [
        {
            "$unwind" : {
                "path" : "$PrjNm"
            }
        }, 
        {
            "$match" : {
                "PrjNm" : req.body.PrjNm,
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                "Project" : {
                    "$first" : "$PrjNm"
                },
                "Exec" : {
                    "$sum" : "$Quantity"
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : {
                    "$subtract" : [
                        "$Plan",
                        "$Exec"
                    ]
                },
                "Progress" : {
                    "$divide" : [
                        "$Exec",
                        "$Plan"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressM" : {
                    "$multiply" : [
                        "$Progress",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressR" : {
                    "$round" : [
                        "$ProgressM",
                        2.0
                    ]
                },
                "Amount" : {
                    "$multiply" : [
                        "$Exec",
                        "$UR"
                    ]
                },
                "PlanAm" : {
                    "$multiply" : [
                        "$Plan",
                        "$UR"
                    ]
                },
                "RemQuanX" : {
                    "$multiply" : [
                        "$RemQuan",
                        "$UR"
                    ]
                }
            }
        }, 
        {
            "$group" : {
                "_id" : "$Project",
                "AmountX" : {
                    "$sum" : "$Amount"
                },
                "PlanAmX" : {
                    "$sum" : "$PlanAm"
                },
                "RemQuanXX" : {
                    "$sum" : "$RemQuanX"
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : {
                    "$divide" : [
                        "$AmountX",
                        "$PlanAmX"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : 1.0,
                "TotPrgres" : {
                    "$multiply" : [
                        "$TotPrg",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : 1.0,
                "TotPrgres" : {
                    "$multiply" : [
                        "$TotPrg",
                        100.0
                    ]
                },
                "TotPrgress" : {
                    "$round" : [
                        "$TotPrgres",
                        2.0
                    ]
                }
            }
        }
    ] 
data.aggregate(pipelineIII, {"Quantity":{$gt:0}, "Plan":{$gt:0}}, function (err, datas3) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
    
        req.flash('success', 'You have successfuly retreived company summary.');
       //res.json(datas3)
       res.render("datas3.ejs", { datas3: datas3, layout: './layouts/datas header' });
       //res.json(datas3)
       console.log("A summary Total Report page by Project Name is retrieved from the database");
    }
})
})
/* RENDER TOTAL SUMMARY REPORT PAGE
------------------------------------------*/

router.get("/datas3", function (req, res) {

   


    var  pipelineIII =  [
        {
            "$unwind" : {
                "path" : "$PrjNm"
            }
        }, 
        {
            "$match" : {
                "PrjNm" : req.body.PrjNm,
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                "Project" : {
                    "$first" : "$PrjNm"
                },
                "Exec" : {
                    "$sum" : "$Quantity"
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : {
                    "$subtract" : [
                        "$Plan",
                        "$Exec"
                    ]
                },
                "Progress" : {
                    "$divide" : [
                        "$Exec",
                        "$Plan"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressM" : {
                    "$multiply" : [
                        "$Progress",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressR" : {
                    "$round" : [
                        "$ProgressM",
                        2.0
                    ]
                },
                "Amount" : {
                    "$multiply" : [
                        "$Exec",
                        "$UR"
                    ]
                },
                "PlanAm" : {
                    "$multiply" : [
                        "$Plan",
                        "$UR"
                    ]
                },
                "RemQuanX" : {
                    "$multiply" : [
                        "$RemQuan",
                        "$UR"
                    ]
                }
            }
        }, 
        {
            "$group" : {
                "_id" : "$Project",
                "AmountX" : {
                    "$sum" : "$Amount"
                },
                "PlanAmX" : {
                    "$sum" : "$PlanAm"
                },
                "RemQuanXX" : {
                    "$sum" : "$RemQuanX"
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : {
                    "$divide" : [
                        "$AmountX",
                        "$PlanAmX"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : 1.0,
                "TotPrgres" : {
                    "$multiply" : [
                        "$TotPrg",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : 1.0,
                "TotPrgres" : {
                    "$multiply" : [
                        "$TotPrg",
                        100.0
                    ]
                },
                "TotPrgress" : {
                    "$round" : [
                        "$TotPrgres",
                        2.0
                    ]
                }
            }
        }
    ] 
data.aggregate(pipelineIII, {"Quantity":{$gt:0}, "Plan":{$gt:0}}, function (err, datas3, JSdatas3) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
        var messages =  req.flash() 
        //res.json(datas3)
res.render("datas3.ejs", { datas3: datas3, messages, layout: './layouts/datas header' });
//res.json(JSdatas3)
        console.log("A summary Total Report page by Project Name is retrieved from the database");
        console.log('datas3')
    }
})
})

/* POST TOTAL SUMMARY FOR ALL PROJECTS REPORT PAGE
------------------------------------------*/

router.post("/datas3T", function (req, res) {

    const errors = validationResult(req);
    if(!errors.isEmpty()){ 
      errors.array().forEach(error => {
      req.flash  ('error:', error.msg)
      })
      res.render('datas2Vald', {messages: req.flash(), layout: './layouts/datas header'})
       return
 }

    var  pipelineIV =  [
        
            {
              $group: {
                _id: {
                  Pro: "$PrjNm",
                  Act: "$filltype",
                },
                Project: { $first: "$PrjNm" },
          
                Exec: { $sum: "$Quantity" },
                Plan: { $sum: "$TotExc" },
                UR: { $sum: "$shrnk" },
              },
            },
            {
              $project: {
                UR: 1.0,
                Project: 1.0,
                Exec: 1.0,
                Plan: 1.0,
                RemQuan: {
                  $subtract: ["$Plan", "$Exec"],
                },
                Progress: {
                  $divide: ["$Exec", "$Plan"],
                },
              },
            },
            {
              $project: {
                UR: 1.0,
                Project: 1.0,
                Exec: 1.0,
                Plan: 1.0,
                RemQuan: 1.0,
                Progress: 1.0,
                ProgressM: {
                  $multiply: ["$Progress", 100.0],
                },
              },
            },
            {
              $project: {
                UR: 1.0,
                Project: 1.0,
                Exec: 1.0,
                Plan: 1.0,
                RemQuan: 1.0,
                Progress: 1.0,
                ProgressR: {
                  $round: ["$ProgressM", 2.0],
                },
                Amount: {
                  $multiply: ["$Exec", "$UR"],
                },
                PlanAm: {
                  $multiply: ["$Plan", "$UR"],
                },
                RemQuanX: {
                  $multiply: ["$RemQuan", "$UR"],
                },
              },
            },
            {
              $group: {
                _id: "$Project",
                AmountX: {
                  $sum: "$Amount",
                },
                PlanAmX: {
                  $sum: "$PlanAm",
                },
                RemQuanXX: {
                  $sum: "$RemQuanX",
                },
              },
            },
            {
              $project: {
                _id: 1.0,
                AmountX: 1.0,
                PlanAmX: 1.0,
                RemQuanXX: 1.0,
                TotPrg: {
                  $divide: ["$AmountX", "$PlanAmX"],
                },
              },
            },
            {
              $project: {
                _id: 1.0,
                AmountX: 1.0,
                PlanAmX: 1.0,
                RemQuanXX: 1.0,
                TotPrg: 1.0,
                TotPrgres: {
                  $multiply: ["$TotPrg", 100.0],
                },
              },
            },
            {
              $project: {
                _id: 1.0,
                AmountX: 1.0,
                PlanAmX: 1.0,
                RemQuanXX: 1.0,
                TotPrg: 1.0,
                TotPrgres: {
                  $multiply: ["$TotPrg", 100.0],
                },
                TotPrgress: {
                  $round: ["$TotPrgres", 2.0],
                },
              },
            },


            {
                $group: {
                  _id: "$PrjNm",
            
                  TotAm: {
                    $sum: "$AmountX",
                  },
                  TotPlan: {
                    $sum: "$PlanAmX",
                  },
                  TotRem: {
                    $sum: "$RemQuanXX",
                  },
                },
              },
              {
                $project: {
                  TotAm: 1.0,
                  TotPlan: 1.0,
                  TotRem: 1.0,
                  Pr: {
                    $divide: ["$TotAm", "$TotPlan"],
                  },
                },
              },
              {
                $project: {
                  TotAm: 1.0,
                  TotPlan: 1.0,
                  TotRem: 1.0,
                  Pr: 1.0,
                  Prog: {
                    $multiply: ["$Pr", 100],
                  },
                },
              },
              {
                $project: {
                  TotAm: 1.0,
                  TotPlan: 1.0,
                  TotRem: 1.0,
                  Prog: 1.0,
                  Progress: {
                    $round: ["$Prog", 2],
                  },
                },
              },

              {
                $group: {
                  _id: "$PrjNm",
            
                  TotAm: {
                    $sum: "$AmountX",
                  },
                  TotPlan: {
                    $sum: "$PlanAmX",
                  },
                  TotRem: {
                    $sum: "$RemQuanXX",
                  },
                },
              },
              {
                $project: {
                  TotAm: 1.0,
                  TotPlan: 1.0,
                  TotRem: 1.0,
                  Pr: {
                    $divide: ["$TotAm", "$TotPlan"],
                  },
                },
              },
              {
                $project: {
                  TotAm: 1.0,
                  TotPlan: 1.0,
                  TotRem: 1.0,
                  Pr: 1.0,
                  Prog: {
                    $multiply: ["$Pr", 100],
                  },
                },
              },
              {
                $project: {
                  TotAm: 1.0,
                  TotPlan: 1.0,
                  TotRem: 1.0,
                  Prog: 1.0,
                  Progress: {
                    $round: ["$Prog", 2],
                  },
                },
              },
            
            
            
            ]
         
        
data.aggregate(pipelineIV, {"Quantity":{$gt:0}, "Plan":{$gt:0}}, function (err, datas3T) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
    
        req.flash('success', 'You have successfuly retreived company summary.');
       //res.json(datas3)
       res.render("datas3T.ejs", { datas3T: datas3T, layout: './layouts/datas header' });
       //res.json(datas3)
       console.log("A summary Total Report page by Project Name is retrieved from the database");
    }
})
})
/* RENDER TOTAL SUMMARY REPORT PAGE FOR ALL PROJECTS
------------------------------------------*/

router.get("/datas3T", function (req, res) {

   


    var  pipelineIV =  [
        
            {
              $group: {
                _id: {
                  Pro: "$PrjNm",
                  Act: "$filltype",
                },
                Project: { $first: "$PrjNm" },
          
                Exec: { $sum: "$Quantity" },
                Plan: { $sum: "$TotExc" },
                UR: { $sum: "$shrnk" },
              },
            },
            {
              $project: {
                UR: 1.0,
                Project: 1.0,
                Exec: 1.0,
                Plan: 1.0,
                RemQuan: {
                  $subtract: ["$Plan", "$Exec"],
                },
                Progress: {
                  $divide: ["$Exec", "$Plan"],
                },
              },
            },
            {
              $project: {
                UR: 1.0,
                Project: 1.0,
                Exec: 1.0,
                Plan: 1.0,
                RemQuan: 1.0,
                Progress: 1.0,
                ProgressM: {
                  $multiply: ["$Progress", 100.0],
                },
              },
            },
            {
              $project: {
                UR: 1.0,
                Project: 1.0,
                Exec: 1.0,
                Plan: 1.0,
                RemQuan: 1.0,
                Progress: 1.0,
                ProgressR: {
                  $round: ["$ProgressM", 2.0],
                },
                Amount: {
                  $multiply: ["$Exec", "$UR"],
                },
                PlanAm: {
                  $multiply: ["$Plan", "$UR"],
                },
                RemQuanX: {
                  $multiply: ["$RemQuan", "$UR"],
                },
              },
            },
            {
              $group: {
                _id: "$Project",
                AmountX: {
                  $sum: "$Amount",
                },
                PlanAmX: {
                  $sum: "$PlanAm",
                },
                RemQuanXX: {
                  $sum: "$RemQuanX",
                },
              },
            },
            {
              $project: {
                _id: 1.0,
                AmountX: 1.0,
                PlanAmX: 1.0,
                RemQuanXX: 1.0,
                TotPrg: {
                  $divide: ["$AmountX", "$PlanAmX"],
                },
              },
            },
            {
              $project: {
                _id: 1.0,
                AmountX: 1.0,
                PlanAmX: 1.0,
                RemQuanXX: 1.0,
                TotPrg: 1.0,
                TotPrgres: {
                  $multiply: ["$TotPrg", 100.0],
                },
              },
            },
            {
              $project: {
                _id: 1.0,
                AmountX: 1.0,
                PlanAmX: 1.0,
                RemQuanXX: 1.0,
                TotPrg: 1.0,
                TotPrgres: {
                  $multiply: ["$TotPrg", 100.0],
                },
                TotPrgress: {
                  $round: ["$TotPrgres", 2.0],
                },
              },
            },

              
            

            
            
            
          ]
        
    
data.aggregate(pipelineIV, {"Quantity":{$gt:0}, "Plan":{$gt:0}}, function (err, datas3T) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
        var messages =  req.flash() 
        //res.json(datas3)
res.render("datas3T.ejs", { datas3T: datas3T, messages, layout: './layouts/datas header' });
//res.json(JSdatas3)
        console.log("A summary Total Report page by Project Name is retrieved from the database");
        console.log('datas3T')
    }
})
})


/* RENDER TOTAL JSON SUMMARY REPORT PAGE
------------------------------------------*/
router.post("/JSdatas3", function (req, res) {
     
    if(req.body.PrjNm === "Project I" || "Project II" || "Project III" || " Project IV " || " Project V " || " Project VI "){
        var theProject = req.body.PrjNm; 
    }

    theProject = req.body.PrjNm;

    var  pipelineIII =  [
        {
            "$unwind" : {
                "path" : "$PrjNm"
            }
        }, 
        {
            "$match" : {
              "PrjNm" : 'Project I',
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                "Project" : {
                    "$first" : "$PrjNm"
                },
                "Exec" : {
                    "$sum" : "$Quantity"
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : {
                    "$subtract" : [
                        "$Plan",
                        "$Exec"
                    ]
                },
                "Progress" : {
                    "$divide" : [
                        "$Exec",
                        "$Plan"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressM" : {
                    "$multiply" : [
                        "$Progress",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressR" : {
                    "$round" : [
                        "$ProgressM",
                        2.0
                    ]
                },
                "Amount" : {
                    "$multiply" : [
                        "$Exec",
                        "$UR"
                    ]
                },
                "PlanAm" : {
                    "$multiply" : [
                        "$Plan",
                        "$UR"
                    ]
                },
                "RemQuanX" : {
                    "$multiply" : [
                        "$RemQuan",
                        "$UR"
                    ]
                }
            }
        }, 
        {
            "$group" : {
                "_id" : "$Project",
                "AmountX" : {
                    "$sum" : "$Amount"
                },
                "PlanAmX" : {
                    "$sum" : "$PlanAm"
                },
                "RemQuanXX" : {
                    "$sum" : "$RemQuanX"
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : {
                    "$divide" : [
                        "$AmountX",
                        "$PlanAmX"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : 1.0,
                "TotPrgres" : {
                    "$multiply" : [
                        "$TotPrg",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : 1.0,
                "TotPrgres" : {
                    "$multiply" : [
                        "$TotPrg",
                        100.0
                    ]
                },
                "TotPrgress" : {
                    "$round" : [
                        "$TotPrgres",
                        2.0
                    ]
                }
            }
        }
    ] 
data.aggregate(pipelineIII, {PrjNm: theProject, "Quantity":{$gt:0}, "Plan":{$gt:0}}, function (err, JSdatas3) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
    
        req.flash('success', 'You have successfuly retreived company summary.');
        res.json(JSdatas3)
        
    
       
    }
})
})

/* RENDER TOTAL JSON SUMMARY REPORT PAGE
------------------------------------------*/
router.get("/JSdatas3", function (req, res) {

    if(req.body.PrjNm === "Project I" || "Project II" || "Project III" || " Project IV " || " Project V " || " Project VI "){
        var theProject = req.body.PrjNm; 
    }


    theProject = req.body.PrjNm;

    var  pipelineIII =  [
        {
            "$unwind" : {
                "path" : '$PrjNm'
            }
        }, 
        {
            "$match" : {
               "PrjNm" : 'Project I',
            }
        }, 
        {
            "$group" : {
                "_id" : "$filltype",
                "Project" : {
                    "$first" : "$PrjNm"
                },
                "Exec" : {
                    "$sum" : "$Quantity"
                },
                "Plan" : {
                    "$sum" : "$TotExc"
                },
                "UR" : {
                    "$sum" : "$shrnk"
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : {
                    "$subtract" : [
                        "$Plan",
                        "$Exec"
                    ]
                },
                "Progress" : {
                    "$divide" : [
                        "$Exec",
                        "$Plan"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressM" : {
                    "$multiply" : [
                        "$Progress",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "UR" : 1.0,
                "Project" : 1.0,
                "Exec" : 1.0,
                "Plan" : 1.0,
                "RemQuan" : 1.0,
                "Progress" : 1.0,
                "ProgressR" : {
                    "$round" : [
                        "$ProgressM",
                        2.0
                    ]
                },
                "Amount" : {
                    "$multiply" : [
                        "$Exec",
                        "$UR"
                    ]
                },
                "PlanAm" : {
                    "$multiply" : [
                        "$Plan",
                        "$UR"
                    ]
                },
                "RemQuanX" : {
                    "$multiply" : [
                        "$RemQuan",
                        "$UR"
                    ]
                }
            }
        }, 
        {
            "$group" : {
                "_id" : "$Project",
                "AmountX" : {
                    "$sum" : "$Amount"
                },
                "PlanAmX" : {
                    "$sum" : "$PlanAm"
                },
                "RemQuanXX" : {
                    "$sum" : "$RemQuanX"
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : {
                    "$divide" : [
                        "$AmountX",
                        "$PlanAmX"
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : 1.0,
                "TotPrgres" : {
                    "$multiply" : [
                        "$TotPrg",
                        100.0
                    ]
                }
            }
        }, 
        {
            "$project" : {
                "_id" : 1.0,
                "AmountX" : 1.0,
                "PlanAmX" : 1.0,
                "RemQuanXX" : 1.0,
                "TotPrg" : 1.0,
                "TotPrgres" : {
                    "$multiply" : [
                        "$TotPrg",
                        100.0
                    ]
                },
                "TotPrgress" : {
                    "$round" : [
                        "$TotPrgres",
                        2.0
                    ]
                }
            }
        }
    ] 
data.aggregate(pipelineIII, { PrjNm: theProject, "Quantity":{$gt:0}, "Plan":{$gt:0}}, function (err, JSdatas3) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
        //res.render("datas3.ejs", { datas3: JSdatas3, messages, layout: './layouts/datas header' });
        res.json(JSdatas3)
        //window.location.href = 'http://localhost:8080/datas3'
        
        
    }
})
})


/* RENDER PROFILE PAGE
------------------------------------------*/
router.get("/comment", function (req, res) {
        data.find({"Quantity":{$gt:0}}, {"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1,"supervisor":1, "picture":1, "profile":1, "comment":1, "Compaction":1, "Rwidth":1}, function (err, comment) {
        if (err) {
            console.log("you have an error!!!");
            console.log(err)
       } else {
            res.render("comment.ejs", { comment: comment, layout: './layouts/datas header' });
            console.log("Comments and pictures are displayed successfuly!!")
        }
    }).sort({ Date: -1 })
})
/* RETRIEVES X-SECTION DATA BY PROJECT
------------------------------------------*/
router.post("/comment", function (req, res) {
    var theProject = req.body.PrjNm;
    data.find({ PrjNm: theProject, "Quantity":{$gt:0} }, {"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1,"supervisor":1, "picture":1, "profile":1, "comment":1}, function (err, comment) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("comment.ejs", { comment: comment, layout: './layouts/datas header' });
            console.log("Comments and pictures are displayed successfuly!!")     }
    }).sort({ stationF: -1 })
})
/* RENDER ROAD MAP PAGE
------------------------------------------*/
router.get("/RdMap", function (req, res) {
    data.find({}, function (err, RdMap) {
        if (err) {
            console.log("you have an error!!!");
            console.log(err)
        } else {
            res.render("RdMap.ejs", { RdMap: RdMap, layout: './layouts/datas header' });
            console.log("Road map is displayed successfuly!!")
        }
    }).sort({ stationF: -1 })
})
/* RETRIEVES DATA BY STATION
------------------------------------------*/
router.post("/findata", function (req, res) {
    var theStation = req.body.stationF;
    data.find({ stationF: theStation,"Quantity":{$gt:0}},{"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1, "approval":1,"supervisor":1,}, function (err, Editdata) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("Editdata.ejs", { Editdata: Editdata, layout: './layouts/datas header' });
            //res.redirect('/editdata')
            console.log("A new data is edited or retrieved from the database");
        }
    }).sort({ stationF: -1 })
})

router.get("/findata", function (req, res) {
    var theStation = req.body.stationF;
    data.find({ stationF: theStation,"Quantity":{$gt:0}},{"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1, "approval":1,"supervisor":1 }, function (err, Editdata) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {S
            res.render("Editdata.ejs", { Editdata: Editdata });
            //res.redirect('/editdata')
            console.log("A new data is edited or retrieved from the database");
        }
    }).sort({ stationF: -1 })
})



router.post("/findataB", function (req, res) {
    var theProject = req.body.PrjNm;
    data.find({ PrjNm: theProject }, function (err, datas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("datas.ejs", { datas: datas });
            console.log("A new data is retrieved from the database");
        }
    }).sort({ stationF: -1 })
})
/* RETRIEVES DATA BY FILL TYPE FROM /datas ROUTER
-------------------------------------------------*/
router.post("/findfilltype", function (req, res) {
    var thefilltype = req.body.filltype;
    data.find({ filltype: thefilltype,"Quantity":{$gt:0}},{"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1, "approval":1, "supervisor":1,}, function (err, Editdata) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("Editdata.ejs", { Editdata: Editdata, layout: './layouts/datas header' });
            console.log("A new data is retrieved from the database");
        }
    }).sort({ stationF: -1 })
})


/* RETRIEVES DATA BY Station TYPE FROM RD-Profile ROUTER
-------------------------------------------------*/

router.post("/findataRD", function (req, res) {
    var theStation = req.body.stationF;
    data.find({ stationF: theStation, "Quantity":{$gt:0}},{"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1, "approval":1, "supervisor":1, "picture":1, "profile":1, "comment":1}, function (err, comment) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("comment.ejs", { comment: comment, layout: './layouts/datas header' });
            console.log("A new data is retrieved from the database");
        }
    }).sort({ stationF: -1 })
})
/* RETRIEVES DATA BY FILL TYPE FROM RD-Profile ROUTER
-------------------------------------------------*/
router.post("/findfilltypeRD", function (req, res) {
    var thefilltype = req.body.filltype;
    data.find({ filltype: thefilltype,"Quantity":{$gt:0}},{"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1, "approval":1, "supervisor":1, "picture":1, "profile":1, "comment":1}, function (err, comment) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("comment.ejs", { comment: comment, layout: './layouts/datas header' });
            console.log("A new data is retrieved from the database");
        }
    }).sort({ stationF: -1 })
})

/* RETRIEVES DATA BY FILL TYPE FROM MAP ROUTER
-------------------------------------------------*/
router.get("/Mapfilltype", function (req, res) {
    var theProject = req.body.PrjNm;
    var thefilltype = req.body.filltype;
    data.find({ PrjNm: theProject, filltype: thefilltype }, function (err, RdMap) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("RdMap.ejs", { RdMap: RdMap, layout: './layouts/datas header' });
            console.log("A new map fiiltype is retrieved from the database");
        }
    }).sort({ stationF: -1 })
})
router.post("/Mapfilltype", function (req, res) {
    var theProject = req.body.PrjNm;
    var thefilltype = req.body.filltype;
    data.find({ PrjNm: theProject, filltype: thefilltype  }, function (err, RdMap) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("RdMap.ejs", { RdMap: RdMap, layout: './layouts/datas header' });
            console.log("A new map fiiltype is retrieved from the database");
        }
    }).sort({ stationF: -1 })
})
/* RETRIEVES DATA BY FILL TYPE FROM ROAD MAP ROUTER
--------------------------------------------------*/
router.post("/MapProtype", function (req, res) {
    var theProjtype = req.body.PrjNm;
        data.find({PrjNm: theProjtype}, function (err, RdMap) {
            if (err) {
                console.log("You have an error")
                console.log(err)
            } else {
                res.render("RdMap.ejs", { RdMap: RdMap });
                console.log("A new mapping data is retrieved from the database");
            }
        }).sort({ stationF: -1 })
    })
/* RETRIEVES DATA BY FILL TYPE FROM ROAD MAP ROUTER
--------------------------------------------------*/
router.post("/PlanProtype", function (req, res) {
    var theProjtype = req.body.PrjNm;
        data.find({PrjNm: theProjtype}, function (err, datas2) {
            if (err) {
                console.log("You have an error")
                console.log(err)
            } else {
                res.render("datas2.ejs", { datas2: datas2 });
                console.log("A new Plan data is retrieved from the database");
            }
        }).sort({ stationF: -1 })
    })
/* REMOVES DATA FROM THE DATABASE data
-------------------------------------------*/
router.post("/deletedata", function (req, res) {
    var theproject = req.body.PrjNm
    var thestationF = req.body.stationF;
    var thefilltype = req.body.filltype;
    data.remove({ stationF: thestationF, PrjNm: theproject, filltype: thefilltype }, function (err, datas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            console.log("A new data is deleted from the database");
            req.flash("danger','You have deleted the data succesfuly!!")
            res.redirect("/editdata");
        }
    })
})
/* REMOVES DATA FROM THE X-SECTION DATA
-------------------------------------------*/
router.post("/deletedataX", function (req, res) {
    var theproject = req.body.PrjNm
    var thestationF = req.body.stationF;
    var thefilltype = req.body.filltype;
    data.remove({ stationF: thestationF, PrjNm: theproject, filltype: thefilltype }, function (err, comment) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            console.log("A new data is x-section deleted from the database");
            req.flash("danger','You have deleted x-section data succesfuly!!")
            res.redirect("/comment");
        }
    })
})
/* REMOVES FILLTYPE-DATA FROM THE DATABASE data
-------------------------------------------*/
router.post("/deletePlan", function (req, res) {
    var theproject = req.body.PrjNm
    var thefilltype = req.body.filltype;
    data.remove({ filltype: thefilltype, PrjNm: theproject }, function (err, datas2) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            console.log("A Plan data is deleted from the database");
            req.flash("danger','You have deleted the Plan data succesfuly!!. However, note that all datas related to this plan has also been deleted." )
            res.redirect("/datas2");
        }
    })
})


/* RETRIEVES FETCHED-API DATA BY PROJECT NAME
------------------------------------------*/
router.post("/fetch", function (req, res) {

    const newdata = JSON.parse(localStorage.getItem('newdata'))
			
    console.log(newdata)

    let Pro = newdata.map(({ Pro }) => Pro);
    let Plan = newdata.map(({ Plan }) => Plan);
    let Exec = newdata.map(({ Exec }) => Exec);
    let Balance = newdata.map(({ Balance }) => Balance)

    console.log(Pro)
    console.log(Plan)
    console.log(Exec)             
    console.log(Balance)
    
    let box = [];
    box.push(
       Pro, Plan, Exec, Balance
    )
    console.log(box)

    var theProject = req.body.PrjNm;
    box.find({ Pro: theProject}, {"Plan":1,"Exec":1,"Balance":1,"Pro":1}, function (err, datas3) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.json(datas3)
            
        }
    }).sort({ Pro: -1 })
})

router.get("/fetch", function (req, res) {

    const newdata = JSON.parse(localStorage.getItem('newdata'))
			
    console.log(newdata)

    let Pro = newdata.map(({ Pro }) => Pro);
    let Plan = newdata.map(({ Plan }) => Plan);
    let Exec = newdata.map(({ Exec }) => Exec);
    let Balance = newdata.map(({ Balance }) => Balance)

    console.log(Pro)
    console.log(Plan)
    console.log(Exec)             
    console.log(Balance)
    
    let box = [];
    box.push(
       Pro, Plan, Exec, Balance
    )
    console.log(box)

    var theProject = req.body.PrjNm;
    box.find({ Pro: theProject}, {"Plan":1,"Exec":1,"Balance":1,"Pro":1}, function (err, datas3) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.json(datas3)
            
        }
    }).sort({ Pro: -1 })
})



module.exports = router;


