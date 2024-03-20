var express = require('express');
var router = express.Router();
const FastMvpController = require("../controllers/fastmvp.controller");

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('Fast Mvp Api Backend');
});

/* POST api listing. */
router.post("/:table/get", FastMvpController.Get);
router.post('/:table/create',FastMvpController.Create);
router.post("/:table/update/all", FastMvpController.Update);
router.post("/:table/update/:key/:value", FastMvpController.Update);
router.post("/:table/delete/:key/:value", FastMvpController.Delete);
module.exports = router;