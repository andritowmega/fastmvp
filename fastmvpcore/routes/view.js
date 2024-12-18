var express = require('express');
var router = express.Router();
const ViewerController = require("../controllers/viewer.controller");
const auth = require("../utils/auth");

router.get('/', ViewerController.Projects);
router.get('/:project', ViewerController.SingleProject);

router.get('/:project/:table', ViewerController.GetTableInfo);


module.exports = router;