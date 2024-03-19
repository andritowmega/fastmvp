var express = require('express');
var router = express.Router();
const FastMvpController = require("../../controllers/fastmvp/fastmvp.controller");

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('Fast Mvp Api Backend');
});

/* POST api listing. */
router.post('/:table/create',FastMvpController.Create);
module.exports = router;