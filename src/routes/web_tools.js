const express = require("express");
const router = express.Router();

//Controller
let webActionController = require("../controllers/web_actions_controller");

//router.post("/webaction", webActionController.make_ping);
router.post("/webaction", webActionController.web_action);
router.get("/", webActionController.user_tools);

module.exports = router;
