const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
module.exports  = mongoose.connect(
  "mongodb+srv://admin:admin@cluster0-oreku.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connection to mongoosdb");
  },
);

