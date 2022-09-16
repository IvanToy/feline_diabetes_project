const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = require("../utils/generateAccessToken.js");
const generateRefreshToken = require("../utils/generateRefreshToken.js");

const Token = require("../models/tokenModel.js");

const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json("You are not authenticated");
  console.log(token, req.body);
  const isRefreshToken = await Token.findOne({ refreshToken: token });
  console.log(isRefreshToken);
  if (isRefreshToken) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tokensDeleted = await Token.deleteOne({ userId: decoded.id });

    if (tokensDeleted) {
      const newAccessToken = generateAccessToken(decoded.id);
      const newRefreshToken = generateRefreshToken(decoded.id);

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      const tokens = await Token.create({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userId: decoded.id,
      });

      if (tokens) {
        console.log("new tokens have been generated successfully");
      }
    }
  } else {
    res.status(404);
    throw new Error("Token not found");
  }
});

module.exports = refreshToken;
