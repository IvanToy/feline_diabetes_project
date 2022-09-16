const express = require("express");
const router = express.Router();
const {
  createPetsProfile,
  getPetsProfile,
} = require("../controllers/petController.js");
const protect = require("../middleware/authMiddleware.js");

router.route("/createProfile").post(protect, createPetsProfile);
router.route("/petsProfile").get(protect, getPetsProfile);

module.exports = router;
