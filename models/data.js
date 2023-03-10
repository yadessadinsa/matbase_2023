
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
const { Double } = require('mongodb');
const { Script } = require('vm');
var LocalStrategy = require('passport-local').Strategy;

// var bycript = require('bycriptjs');

/* CONNECTION METHOD TO CONNECT TO THE DATABASE
-----------------------------------------------*/
    var  data = mongoose.connection;
    var Schema = mongoose.Schema;

var dataSchema = new mongoose.Schema({
    Unitrate: "number",
    TotExc: "number",
    stationF: "number",
    stationT: "number",  
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
    
     
    
},
{
    timestamps: true,
}
)



var data = mongoose.model('data', dataSchema)
module.exports = data;


