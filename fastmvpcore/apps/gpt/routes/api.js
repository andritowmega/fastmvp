let express = require("express");
let router = express.Router();
const GptController = require("../controllers/gpt.controller");
router.post(
    "/:project/chat",
    GptController.SingleChat
  );
module.exports = router;