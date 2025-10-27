let express = require("express");
let router = express.Router();
const FastMvpController = require("../controllers/fastmvp.controller");
const MediaServerController = require("../controllers/mediaserver.controller");
const auth = require("../utils/auth");

/* GET api listing. */
router.get("/", function (req, res, next) {
  res.send("Fast Mvp Api Backend");
});

/* POST api CloudFlareImages */
router.post(
  "/:project/cloudflareimg/upload",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.UploadImageCF
);
router.post(
  "/:project/cloudflareimg/delete",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.DeleteImageCF
);

/* POST api listing. */
router.post(
  "/:project/orderedlist",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.OrderedList
);
router.post(
  "/:project/auth/:table/password",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.UpdatePassword
);
router.post(
  "/:project/auth/:table1/:table2/token/info",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.GetInfo
);
router.post(
  "/:project/auth/token/info",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.InfoToken
);
router.post("/:project/auth/:table/token/check", FastMvpController.CheckToken);
router.post(
  "/:project/:table/get",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.Get
);
router.post(
  "/:project/:table/create",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.Create
);
router.post(
  "/:project/:table1/innerj/:table2",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.InnerJoin
);
router.post(
  "/:project/:table1/innerj/:table2/right",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.InnerJoinRight
);
router.post(
  "/:project/:table1/innerj/:table2/left",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.InnerJoinLeft
);
router.post(
  "/:project/:table/update/:key/:value",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.Update
);
router.post(
  "/:project/:table/repetitivetask/update",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.RepetitiveTaskUpdate
);
router.post(
  "/:project/:table/delete/:key/:value",
  auth.authenticateUser,
  auth.replaceWithUserData,
  FastMvpController.Delete
);

//Media Server
router.get("/:project/files/mp3/free/:name", MediaServerController.Mp3Files);
router.get("/:project/files/mp3/free/:level1:/:level2:/:name", MediaServerController.Mp3Files);

module.exports = router;
