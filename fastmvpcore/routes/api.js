var express = require('express');
var router = express.Router();
const FastMvpController = require("../controllers/fastmvp.controller");
const auth = require("../utils/auth");

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('Fast Mvp Api Backend');
});

/* POST api listing. */
router.post("/:project/orderedlist",auth.authenticateUser, FastMvpController.OrderedList);
router.post("/:project/auth/:table/token/check",auth.authenticateUser, FastMvpController.CheckToken);
router.post("/:project/:table/get",auth.authenticateUser, FastMvpController.Get);
router.post("/:project/:table/create",auth.authenticateUser, FastMvpController.Create);
router.post("/:project/:table1/innerj/:table2",auth.authenticateUser, FastMvpController.InnerJoin);
router.post("/:project/:table1/innerj/:table2/right",auth.authenticateUser, FastMvpController.InnerJoinRight);
router.post("/:project/:table1/innerj/:table2/left",auth.authenticateUser, FastMvpController.InnerJoinLeft);
router.post("/:project/:table/update/:key/:value",auth.authenticateUser, FastMvpController.Update);
router.post("/:project/:table/delete/:key/:value",auth.authenticateUser, FastMvpController.Delete);

module.exports = router;