var express = require('express');
var router = express.Router();
const FastMvpController = require("../controllers/fastmvp.controller");

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('Fast Mvp Api Backend');
});

/* POST api listing. */
router.post("/:project/:table/get", FastMvpController.Get);
router.post("/:project/:table/create", FastMvpController.Create);
router.post("/:project/:table/update/all", FastMvpController.Update);
router.post("/:project/:table1/innerj/:table2", FastMvpController.InnerJoin);
router.post("/:project/:table1/innerj/:table2/right", FastMvpController.InnerJoinRight);
router.post("/:project/:table1/innerj/:table2/left", FastMvpController.InnerJoinLeft);
router.post("/:project/:table/update/:key/:value", FastMvpController.Update);
router.post("/:project/:table/delete/:key/:value", FastMvpController.Delete);

module.exports = router;