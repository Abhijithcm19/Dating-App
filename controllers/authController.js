const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const { log } = require("winston");
const User = require("../models/userSchame");

// @description: Register a new user
// @route: POST /api/auth/signup
// @access: Public
exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRepository.createUser(username, email, hashedPassword);

    return res.json({ message: "Signup Success" });
  } catch (error) {
    logger.error("Error in signup:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// @description: Authenticate user and get token
// @route: POST /api/auth/login
// @access: Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await userRepository.findByEmail(email);
    console.log("data : ", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await userRepository.comparePasswords(
      password,
      user.password
    );

    console.log("validate data : ", validPassword);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    logger.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    let user = await User.findOne({ email }); // Use the User model to find user by email

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      user = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await user.save();
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
