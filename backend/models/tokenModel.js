const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  accessToken: { type: String },
  refreshToken: { type: String },
});

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;
