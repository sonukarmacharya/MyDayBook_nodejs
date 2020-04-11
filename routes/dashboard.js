var express = require('express');
var dayModel = require('../modules/dayDb')
var uModel = require('../modules/users')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

var router = express.Router();

if(typeof localStorage == "undefined" || localStorage == null){
  const LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage("./scratch")
}

var day = dayModel.find({})
var u = uModel.find({})

// function checkUser(req,res,next){
//   var user = req.body.uname
//   var checkExistuser = uModel.findOne({username:user})
//   checkExistuser.exec((err,data)=>{
//     if(data)
//     return res.render('signup',{title:'Signup',msg:'Username already exist'})
//   })
// }

function checkLoginuser(req,res,next){
  var userToken= localStorage.getItem('userToken')
  try{
    var decodeer = jwt.verify(userToken,'loginToken')
  }
  catch(err){
    res.redirect('/login')
  }
  next()
}
router.get('/',checkLoginuser, function(req, res, next) {
    var userToken= localStorage.getItem('userToken')
    var perpage =2 
    var page = req.params.page || 1
    day.skip((perpage * page)-perpage).limit(perpage).exec(function(err,data){
      if(err) throw err
      dayModel.countDocuments({}).exec((err,count)=>{
      res.render('dashboard', {
         data: data,
         msg:'',
        current: page,
      pages:Math.ceil(count / perpage) });
    })})
   });
   router.get('/:page',checkLoginuser, function(req, res, next) {
    var userToken= localStorage.getItem('userToken')
    var perpage =2 
    var page = req.params.page || 1
    day.skip((perpage * page)-perpage).limit(perpage).exec(function(err,data){
      if(err) throw err
      dayModel.countDocuments({}).exec((err,count)=>{
      res.render('dashboard', {
         data: data,
         msg:'',
        current: page,
      pages:Math.ceil(count / perpage) });
    })})
   });

   
   module.exports = router;
