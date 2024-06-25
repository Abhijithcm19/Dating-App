const express = require("express");
const { signup, login, google } = require("../controllers/authController");
const {
  validateSignup,
  validateLogin,
} = require("../validators/authValidator");

const router = express.Router();

// Route to handle user signup
router.post("/signup", validateSignup, signup);

// Route to handle user login
router.post("/login", validateLogin, login);
router.post("/google", google);

module.exports = router;
