const asyncHandler = require("express-async-handler");

const User = require("../models/userModel.js");
const Pet = require("../models/petModel.js");
const Curve = require("../models/curveModel.js");
const Token = require("../models/tokenModel.js");

const generateAccessToken = require("../utils/generateAccessToken.js");
const generateRefreshToken = require("../utils/generateRefreshToken.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    isUserRegistered: true,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  if (user) {
    res.status(200).json({
      accessToken,
      refreshToken,
      isUserRegistered: user.isUserRegistered,
      isPetsProfileCreated: user.isPetsProfileCreated,
      hasChartData: user.hasChartData,
    });

    const tokens = await Token.create({
      userId: user._id,
      accessToken,
      refreshToken,
    });

    if (tokens) {
      console.log("Tokens have been successfully generated!");
    }
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      accessToken,
      refreshToken,
      isUserRegistered: user.isUserRegistered,
      isPetsProfileCreated: user.isPetsProfileCreated,
      hasChartData: user.hasChartData,
    });

    const tokens = await Token.create({
      userId: user._id,
      accessToken,
      refreshToken,
    });

    if (tokens) {
      console.log("Tokens have been successfully generated!");
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const { accessToken } = req.body;

  if (accessToken) {
    const deleteToken = await Token.deleteOne({ accessToken: accessToken });

    if (deleteToken) {
      res.status(200).json({
        accessToken: null,
        refreshToken: null,
        isUserRegistered: false,
        isPetsProfileCreated: false,
        hasChartData: false,
      });
    }
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } else {
    throw new Error("User could not be found");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;

    await user.save();

    res.status(200).json({
      message: "profile has been updated",
    });
  } else {
    res.status(410);
    throw new Error("Profile couldn't be found");
  }
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.deleteOne({ _id: req.user._id });
  const pet = await Pet.deleteOne({ userId: req.user._id });
  const token = await Token.deleteOne({ userId: req.user._id });
  const curve = await Curve.deleteOne({ userId: req.user._id });

  if (user && pet && token && curve) {
    res.status(200).json({
      userInfo: null,
      accessToken: null,
      refreshToken: null,
      isUserRegistered: false,
      isPetsProfileCreated: false,
      hasChartData: false,
    });
  } else {
    res.status(410);
    throw new Error("Something went wrong");
  }
});

const getUserPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      password,
    });
  } else {
    throw new Error("Passwords do not match");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getUserPassword,
  updateUser,
  deleteUserProfile,
};
