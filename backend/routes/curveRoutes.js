const express = require("express");
const router = express.Router();
const { addCurve, getCurve } = require("../controllers/curveController.js");
const protect = require("../middleware/authMiddleware.js");

router.route("/").post(protect, addCurve);
router.route("/:id").get(protect, getCurve);

module.exports = router;
