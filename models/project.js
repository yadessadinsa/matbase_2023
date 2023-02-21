

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
//const { Double } = require('mongodb');
var LocalStrategy = require('passport-local').Strategy;

// var bycript = require('bycriptjs');

/* CONNECTION METHOD TO CONNECT TO THE DATABASE
-----------------------------------------------*/
    var  project = mongoose.connection;
    var Schema = mongoose.Schema;
    
var dataSchema = new mongoose.Schema({
    project1:"string",
    Unitrate: "number",
    TotExc: "number",
    stationF: "string",
    stationT: "string",
    filltype: "string",
    layerno: "number",
    thickness: "number",
    Quantity: 'number',
    approval: "string",
    supervisor: "string",
    Date: "string",
    comment: "string",
    picture: "string",
    profile: "string",
    layerIm: "string",
    Evolume: "number",
    shrnk: "number",
    BPname: "string",
    MatCol: "string",
    MatLyr: "string",
    RemQnt: "number",
    PrjNm: "string",
    ProjTyp:{
        Actvity: "string",
        UnitMsr:'string',
        Unitrate:'number'
    },
    Prjdata: 'string'

    
          
}

)



var project = mongoose.model('project', dataSchema)
module.exports = project;


