const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getUserPassword,
} = require("../controllers/userController.js");
const protect = require("../middleware/authMiddleware.js");

router.route("/").get(protect, getUser);
router.route("/password").post(protect, getUserPassword);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

module.exports = router;
