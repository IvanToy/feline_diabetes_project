const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getUserPassword,
  updateUser,
  deleteUserProfile,
} = require("../controllers/userController.js");
const protect = require("../middleware/authMiddleware.js");

router.route("/").get(protect, getUser);
router.route("/password").post(protect, getUserPassword);
router.route("/update").patch(protect, updateUser);
router.route("/delete").delete(protect, deleteUserProfile);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

module.exports = router;
