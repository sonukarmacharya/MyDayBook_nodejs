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
    res.redirect('/')
  }
  next()
}

/* GET home page. */
router.post('/',   function(req, res, next) {
  var user = req.body.uname
  var pass = req.body.pass  
   var checkUname = uModel.findOne({username : user})
   checkUname.exec((err,data)=>{
     if(err) throw err
     var getId = data._id
     var getPass = data.password
     if(bcrypt.compareSync(pass,getPass)){
       var token = jwt.sign({userId: getId},'loginToken')
       localStorage.setItem('userToken',token)
       res.redirect('/dash')
     }
     else{
      res.render('index', { msg:'Incorrect username or password'});
     }
   })
  })
router.get('/', function(req, res, next) {
  var userToken= localStorage.getItem('userToken')
  if(userToken){
    res.redirect('/dash')
  }
  else{
  res.render('index', { msg: ' ' });
}
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken')
  res.redirect('/')
});

router.post('/signup',[check('pass').isLength({ min: 5 })],function(req, res, next) {
  var userToken= localStorage.getItem('userToken')
  var user = req.body.uname
  var checkExistuser = uModel.findOne({username:user})
  const errors = validationResult(req);
  checkExistuser.exec((err,data)=>{
    if(data)
    return res.render('signup',{title:'Signup',msg:'Username already exist'})
 
  if(!errors.isEmpty()){
    
      res.render('signup',{title:'Signup',msg:'Password must have at least 5 characters'})
    }
   else{
    // res.render('signup',{title:'Signup',msg:'password not match'})
    var username = req.body.uname
    var pass = req.body.pass
    var cpass = req.body.cpass
    if(pass!=cpass){
      res.render('signup',{title:'Signup',msg:'password not match'})
    }
    else{
      pass = bcrypt.hashSync(pass,10)
      var userDetail = new uModel({
        username : username,
        password : pass,
      })
      userDetail.save(function(err,data){
        if(err) throw err
        res.render('signup',{title:'Signup',msg:'Registered successfully'})
      })
  
    }
   }
  })
  
 
});
router.get('/signup', function(req, res, next) {
  var userToken= localStorage.getItem('userToken')
  if(userToken){
    res.redirect('/dash')
  }
  else{
  res.render('signup', { title: 'My Day Book',msg:'' });
  }
});




router.get('/addDay', function(req, res, next) {
  res.render('addDay', { msg:'' });
});
router.post('/addDay',checkLoginuser, function(req, res, next) {
  var userToken= localStorage.getItem('userToken')
  var title = req.body.title
  var tarea = req.body.tarea
  var add = new dayModel({
    title : title,
    detail : tarea
  })
  add.save((err,data)=>{
    if(err) throw err
    res.render('addDay',{msg:'Added successfully'})

  })
});

router.get('/delete/:id', function(req, res, next) {
  var userToken= localStorage.getItem('userToken')
  var id = req.params.id
  var del = dayModel.findByIdAndDelete(id)
  del.exec((err,data)=>{
    if(err) throw err
    day.exec((err,data)=>{
      if(err) throw err
      res.render('dashboard', {data:data, msg:'Deleted successfully' });
 
        })
     })
  
});

router.post('/search', function(req, res, next) {
  var userToken= localStorage.getItem('userToken')
  var fltrname = req.body.searchformTitle
  console.log(fltrname)
  // var searchSts = dayModel.find({title:fltrname})
  // searchSts.exec(function(err,data){
  //   if(err) throw err
    res.render('dashboard', { data: data,msg:'' });
  
  //}) 
});
// router.post('/search', function(req, res, next) {
//   var fltr = req.body.searchformTitle
  
//   var s = dayModel.find({title:fltr})
//   s.exec((err,data)=>{
//     if(err) throw err
//     res.render('dashboard', { data:data,msg:'' });
//   })

// });

router.get('/edit/:id', function(req, res, next) {
  var userToken= localStorage.getItem('userToken')
  var id = req.params.id
  var up = dayModel.findByIdAndUpdate(id)
  up.exec(function(err,data){
    if(err) throw err
    res.render('update', { data: data,msg:'' });
  })
});

router.post('/update', function(req, res, next) {
  var userToken= localStorage.getItem('userToken')
  var update= dayModel.findByIdAndUpdate(req.body.id,{
    title:  req.body.title,
    detail: req.body.tarea,    
  })
  update.exec((err,data)=>{
    if(err) throw err
    day.exec(function(err,data){
      if(err) throw err
      res.render('dashboard', { data: data,msg:'updated successfully' });
    })
  })
});
module.exports = router;
