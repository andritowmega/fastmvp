var express = require('express');
var router = express.Router();
const ViewerController = require("../controllers/viewer.controller");
const auth = require("../utils/auth");

router.get('/', ViewerController.Projects);

module.exports = router;