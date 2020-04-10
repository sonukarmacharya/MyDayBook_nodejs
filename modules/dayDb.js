var mongoose = require('mongoose')
mongoose.connect('mongodb+srv://<admin>:<admin>@cluster0-oreku.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true})

var conn = mongoose.connection

var dayBookSchema = new mongoose.Schema({
    title: String,
    detail: String,
    imagename: String,
})

var dayBookModel = mongoose.model('DayBook',dayBookSchema)

module.exports = dayBookModel