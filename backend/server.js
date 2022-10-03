const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");

const connectDB = require("./config/db.js");

const userRoutes = require("./routes/userRoutes.js");
const petRoutes = require("./routes/petRoutes.js");
const curveRoutes = require("./routes/curveRoutes.js");
const refreshToken = require("./routes/refreshTokenRoute.js");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/curve", curveRoutes);
app.use("/api/refresh", refreshToken);

const PORT = process.env.PORT || 4000;
const ENVIRONMENT = process.env.NODE_ENV;

app.listen(
  PORT,
  console.log(`Server is in ${ENVIRONMENT} running on port ${PORT}`.green.bold)
);
