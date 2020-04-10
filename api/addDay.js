var express = require('express');
var router = express.Router();

router.get("/",function(req,res,next){
    res.send("Nodejs Resful API GET Method Working")
})