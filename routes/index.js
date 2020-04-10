var express = require('express');
var router = express.Router();
var dayModel = require('../modules/dayDb')
var uModel = require('../modules/users')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');



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
    if(req.session.user){
    var decodeer = jwt.verify(userToken,'loginToken')
  }
  else{  res.redirect('/')}
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
       localStorage.setItem('loginUser', user)
       req.session.user=user
       res.redirect('/dash')
     }
     else{
      res.render('index', { msg:'Incorrect username or password'});
     }
   })
  })
router.get('/', function(req, res, next) {
  var userToken= localStorage.getItem('loginUser')
  if(userToken){
    res.redirect('/dash')
  }
  else{
  res.render('index', { msg: ' ' });
}
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    if(err){
      res.redirect('/')
    }
  })
  // localStorage.removeItem('loginUser')
  res.redirect('/')
});

router.post('/signup',[check('pass').isLength({ min: 5 })],function(req, res, next) {
  var userToken= localStorage.getItem('loginUser')
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
  var userToken= localStorage.getItem('loginUser')
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
  var userToken= localStorage.getItem('loginUser')
  var id = req.params.id
  var del = dayModel.findByIdAndDelete(id)
  del.exec((err,data)=>{
    if(err) throw err
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
  })
  
});

router.get('/autocomplete', function(req, res, next) {
  var regex = new RegExp(req.query["term"],'i')
  var  day = dayModel.find({title:regex},{'title':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(5)
  day.exec(function(err,data){
    
    var result = []
    if(!err){
      if(data && data.length && data.length>0){
        data.forEach(d=>{
          let obj= {
            id: d._id,
            label:d.title,
          }      
          result.push(obj)    
        })
      }
     
      res.jsonp(result)
    }
  })

});
router.post('/search', function(req, res, next) {
  var userToken= localStorage.getItem('loginUser')
  var fltrname = req.body.searchtitle
  console.log(fltrname)
  console.log("fltrname")
  var searchSts = dayModel.find({title:fltrname})
  searchSts.exec(function(err,data){
    if(err) throw err
    res.render('dashboard', { data: data,msg:'' });
  
  }) 
});

router.get('/edit/:id', function(req, res, next) {
  var userToken= localStorage.getItem('loginUser')
  var id = req.params.id
  var up = dayModel.findByIdAndUpdate(id)
  up.exec(function(err,data){
    if(err) throw err
    res.render('update', { data: data,msg:'' });
  })
});

router.post('/update', function(req, res, next) {
  var userToken= localStorage.getItem('loginUser')
  var update= dayModel.findByIdAndUpdate(req.body.id,{
    title:  req.body.title,
    detail: req.body.tarea,    
  })
  update.exec((err,data)=>{
    if(err) throw err
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
  })
});

router.get('/dash',checkLoginuser, function(req, res, next) {
  var userToken= localStorage.getItem('loginuser')
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
 router.get('dash/:page',checkLoginuser, function(req, res, next) {
  var userToken= localStorage.getItem('loginUser')
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
