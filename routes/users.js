var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({message:"Users ko chii veyo aarko chii ejs ma proble hoo so hernu hola tapai ko modules haru ma chii problem theyo "});
});

module.exports = router;
