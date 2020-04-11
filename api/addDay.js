var express = require('express');
var router = express.Router();
var dayModel = require("../modules/dayDb");
var day = dayModel.find({},{'_id':0});

router.get("/",function(req,res,next){
    day.exec((err,data)=>{
        res.send(data)
    })
   
})

module.exports = router