const asyncHandler = require("express-async-handler");

const User = require("../models/userModel.js");
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
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  if (user) {
    res.status(200).json({
      accessToken,
      refreshToken,
      isRegistered: true,
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
      isRegistered: true,
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
  console.log(req.body);

  if (accessToken) {
    const deleteToken = await Token.deleteOne({ accessToken: accessToken });

    if (deleteToken) {
      res.status(200).json({
        message: "logged out",
      });
    }
  }
});

module.exports = { registerUser, loginUser, logoutUser };
