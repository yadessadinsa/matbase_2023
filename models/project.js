
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
const { Double } = require('mongodb');
var LocalStrategy = require('passport-local').Strategy;

// var bycript = require('bycriptjs');

/* CONNECTION METHOD TO CONNECT TO THE DATABASE
-----------------------------------------------*/
 let projectname = [
    {id:1, projectname:'Project I' },
    {id:2, projectname:'Project II' },
    {id:3, projectname:'Project III' }
 ] 



//module.exports = {projectname};
