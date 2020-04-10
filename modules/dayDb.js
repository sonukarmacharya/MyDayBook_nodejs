var mongoose = require("mongoose");

var dayBookSchema = mongoose.Schema({
  title: String,
  detail: String,
  imagename: String,
});
module.exports = mongoose.model("DayBook", dayBookSchema);
