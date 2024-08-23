var express = require('express');
var router = express.Router();
const FastMvpController = require("../controllers/fastmvp.controller");
const auth = require("../utils/auth");

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('Fast Mvp Api Backend');
});

/* POST api CloudFlareImages */
router.post("/:project/cloudflareimg/upload",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.UploadImageCF);

/* POST api listing. */
router.post("/:project/orderedlist",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.OrderedList);
router.post("/:project/auth/:table/password",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.UpdatePassword);
router.post("/:project/auth/:table1/:table2/token/info",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.GetInfo);
router.post("/:project/auth/:table/token/check", FastMvpController.CheckToken);
router.post("/:project/:table/get",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.Get);
router.post("/:project/:table/create",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.Create);
router.post("/:project/:table1/innerj/:table2",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.InnerJoin);
router.post("/:project/:table1/innerj/:table2/right",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.InnerJoinRight);
router.post("/:project/:table1/innerj/:table2/left",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.InnerJoinLeft);
router.post("/:project/:table/update/:key/:value",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.Update);
router.post("/:project/:table/repetitivetask/update",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.RepetitiveTaskUpdate);
router.post("/:project/:table/delete/:key/:value",auth.authenticateUser,auth.replaceWithUserData, FastMvpController.Delete);




module.exports = router;