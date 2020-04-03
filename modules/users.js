var mongoose = require('mongoose')
mongoose.connect('mmongodb://localhost:27017/dayBook',{useNewUrlParser:true,useCreateIndex:true})

var conn = mongoose.connection

var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        index:{
            unique:true
        }
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }

})

var userModel = mongoose.model('users',userSchema)
module.exports = userModel