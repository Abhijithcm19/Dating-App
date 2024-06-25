const express = require("express");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter.js");
const cors = require("cors");
const connectDb = require("./config/dbConnection.js");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const logger = require("./utils/logger.js");

connectDb();
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Middleware to log incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
