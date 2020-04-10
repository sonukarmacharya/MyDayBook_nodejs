const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const db = mongoose.connect(
  "mongodb+srv://rent2:rent2@merorent2-k6wcv.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connection to mongoosdb");
  },
);
module.exports = db;