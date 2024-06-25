const jwt = require("jsonwebtoken");
const User = require("../models/userSchame");
const logger = require("../utils/logger");

// Middleware to authenticate user requests using JWT token

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Error in authentication:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
