
//mmongodb://localhost:27017/dayBook
// var conn = mongoose.connection
let mongoose = require("mongoose")
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