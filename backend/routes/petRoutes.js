const express = require("express");
const router = express.Router();
const {
  createPetsProfile,
  getPetsProfile,
  updatePetsProfile,
  deletePetsProfile,
} = require("../controllers/petController.js");
const protect = require("../middleware/authMiddleware.js");

router.route("/createProfile").post(protect, createPetsProfile);
router.route("/petsProfile").get(protect, getPetsProfile);
router.route("/updateProfile").patch(protect, updatePetsProfile);
router.route("/deleteProfile").delete(protect, deletePetsProfile);

module.exports = router;
