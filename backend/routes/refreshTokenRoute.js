const express = require("express");
const router = express.Router();
const refreshToken = require("../controllers/refreshTokenController.js");

router.route("/").post(refreshToken);

module.exports = router;
