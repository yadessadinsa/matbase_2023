var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser')
var {check, validationResult} = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var data = require('../models/data.js');


var dataStatus = require('../controller/dataStatus.js')
var flash = require('connect-flash');

const urlencodedParser = bodyParser.urlencoded({extended: false})
/* ABOUT ROUTER
------------------------------------------------*/
router.get('/about', function (req, res, next) {
    res.render('First headerxx', { layout:'./layouts/About header'})
})
/* AUTHENTICATION ROUTES
   SIGN UP PAGES
------------------------------------------------*/ 
router.get('/register', function (req, res) {
    res.render('register.ejs')
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
check('password', 'Password field is required')
.exists(),
check('password2', 'You need to conform your password!')
.exists(),
check('password2', 'Password do not match')
.equals('password'),
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
};
    User.create(newUser, function(err, user){
         //newuser.save(function (err, savedUser) {
        if (err) throw err;
            console.log(user)
            return res.status(500).send()
            return res.render('register')
        });
            req.flash('name','You are now registered and authorized to login!')
            //res.location('/login')
            res.redirect('/login')
    })
  /*LOGIN RENDERING PAGE
--------------------------------------*/
router.get('/login', function (req, res) {
    var UserName = req.flash('name')
    res.render('login.ejs', {UserName, layout:'./layouts/intro header'})
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
    router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash:('danger','Invalid username or pssword!! Please re-enter the credentials correctly.' )}),
  function(req, res) {
    req.flash('success', `${users.UserName} You are now succefully logged in to the program!`);
    res.redirect('/intro');
  });
/* LOGIN REDIRECTED TO INTRO PAGE
   MIDDLEWARE
----------------------------------------*/    
router.get('/intro', function (req, res) {
    res.render('intro' ,{message:req.flash(), layout: './layouts/About header'});
})
/* LOGIN LOGIC
   MIDDLEWARE
----------------------------------------*/
router.post('/login', function (req, res) {
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
})
/* LOGOUT PAGE
------------------------------------------*/ 
router.get('/logout', function (req, res) {
    //req.logout();
    req.flash('success', 'You are now logged out!!')
    res.redirect('/');
})
/* RETRIEVES ALL DATA FROM THE DATABASE DATA
-------------------------------------------------*/
/*var pipelineSrt = [
    {
        '$match': {
           },
      },    
                    {
                       '$sort': {
                           'Date': -1
                          }
                     }
                   ]*/
router.get("/datas", ensureAuthenticated, function (req, res) {
    data.find({"Quantity":{$gt:0}}, {"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1,"supervisor":1,}, function (err, datas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            var messages =  req.flash()                    
            res.render("datas.ejs", {datas: datas, messages, layout: './layouts/datas header'});
            console.log("All the datas are retrieved from the database")
        }
    }).sort({Date: -1})
})
router.get("/Editdata", ensureAuthenticated, function (req, res) {
    data.find({"Quantity":{$gt:0}}, {"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1,"supervisor":1,}, function (err, Editdata) {
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


        
        
        
   
   
    
const validationBodyRules = [
    // form validator
    check('PrjNm', 'The project name is not inserted!')
    //.matches("Project I" || "Project II" || "Project III" || " Project IV " || " Project V " || " Project VI " ),
    .exists()
    
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
            V = ((req.body.stationT - req.body.stationF) * (req.body.Rwidth) * (req.body.thickness) * 0.001 * (req.body.shrnk));
            return V;
        }
        var P = req.body.picture;
        if (P) {
            P = req.body.picture;
        } else {
            P = "000.jpg";
        };
    // Color match with fill type
        if (req.body.filltype === "Rock fill") {
             Col = "A";
        }
         else if (req.body.filltype === "G3") {
             Col = "B";
        }
        else if (req.body.filltype === "G7") {
            Col = "C";
        }
        else if (req.body.filltype === "G15") {
           Col = "D";
        }
        else if (req.body.filltype === "Sub base") {
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
            "$sort" : {
                "PrjNm" : -1
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
const validationBodyRules2 = [
    // form validator
    check('PrjNm', 'The project name is not inserted!')
    .matches("Project I" || "Project II" || "Project III" || " Project IV " || " Project V " || " Project VI " ),
       ] 
router.post("/addatas2", validationBodyRules2, ensureAuthenticated, function (req, res) {
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
                "PrjNm" : req.body.PrjNm
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
           // res.redirect('/datas2')
        }
    })
})
/* RENDER TOTAL SUMMARY REPORT PAGE
------------------------------------------*/
router.post("/datas3", function (req, res) {
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
data.aggregate(pipelineIII, function (err, datas3) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
        req.flash('success', 'You have successfuly retreived company summary.');
        //res.redirect('/datas3');
        res.render("datas3.ejs", { datas3: datas3, layout: './layouts/datas header' });
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
data.aggregate(pipelineIII, function (err, datas3) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
        var messages =  req.flash() 
res.render("datas3.ejs", { datas3: datas3, messages, layout: './layouts/datas header' });
        console.log("A summary Total Report page by Project Name is retrieved from the database");
    }
})
})
/* RENDER PROFILE PAGE
------------------------------------------*/
router.get("/comment", function (req, res) {
        data.find({"Quantity":{$gt:0}}, {"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1,"supervisor":1, "picture":1, "profile":1}, function (err, comment) {
        if (err) {
            console.log("you have an error!!!");
            console.log(err)
       } else {
            res.render("comment.ejs", { comment: comment, layout: './layouts/datas header' });
            console.log("Comments and pictures are displayed successfuly!!")
        }
    }).sort({ stationF: -1 })
})
/* RETRIEVES X-SECTION DATA BY PROJECT
------------------------------------------*/
router.post("/comment", function (req, res) {
    var theProject = req.body.PrjNm;
    data.find({ PrjNm: theProject, "Quantity":{$gt:0} }, {"stationF":1,"stationT":1,"Date":1,"PrjNm":1,"filltype":1,"Quantity":1,"BPname":1,"supervisor":1, "picture":1, "profile":1}, function (err, comment) {
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
    data.find({ stationF: theStation }, function (err, Editdata) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("Editdata.ejs", { Editdata: Editdata });
            console.log("A new data is retrieved from the database");
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
    data.find({ filltype: thefilltype }, function (err, Editdata) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("Editdata.ejs", { Editdata: Editdata, layout: './layouts/datas header' });
            console.log("A new data is retrieved from the database");
        }
    }).sort({ stationF: -1 })
})
/* RETRIEVES DATA BY FILL TYPE FROM MAP ROUTER
-------------------------------------------------*/
router.get("/Mapfilltype", function (req, res) {
    var thefilltype = req.body.filltype;
    data.find({ filltype: thefilltype }, function (err, RdMap) {
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
    var thefilltype = req.body.filltype;
    data.find({ filltype: thefilltype }, function (err, RdMap) {
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
module.exports = router;