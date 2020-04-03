var mongoose = require('mongoose')
mongoose.connect('mmongodb://localhost:27017/dayBook',{useNewUrlParser:true})

var conn = mongoose.connection

var dayBookSchema = new mongoose.Schema({
    title: String,
    detail: String,
    imagename: String,
})

var dayBookModel = mongoose.model('DayBook',dayBookSchema)

module.exports = dayBookModel