

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
//const { Double } = require('mongodb');
var LocalStrategy = require('passport-local').Strategy;

// var bycript = require('bycriptjs');

/* CONNECTION METHOD TO CONNECT TO THE DATABASE
-----------------------------------------------*/
    /*var  project = mongoose.connection;
    var Schema = mongoose.Schema;
    
var dataSchema = new mongoose.Schema({*/


    var project = ["Project I", "Project II", "Project III", "Project IV", "Project V", "Project VI"];
    var activity = [
        "Clearing and grub --(Ha)",
        "Borrow mat. to fill.(m3)",
        "R/B pr & unsuitable.(m3)",
        "Cut-mat. to spoil...(m3)",
                                                                                                                                                                                             "Sub-base placing..../m3./",
        "Road base prod......(m3)",
        "Prime application...(m2)",
        "Asph.agg production.(m3)",
        "Asphalt conc placing(m3)",
        "Surface treatment...(m2)",
        "Open drains.........(Lm)",
        "Paved ditch.........(m2)",
        "Ditch with cover...(pc)",
        "Box & Slab culvert-(pc)",
        "Protection walls....(m3)"

           
]
    


//var project = mongoose.model('project', dataSchema)

module.exports = {project, activity}


