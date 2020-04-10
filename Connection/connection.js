const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const db = mongoose.connect(
  "mongodb+srv://abc:qwe123@cluster0-oreku.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connection to mongoosdb");
  },
);
module.exports = db;
