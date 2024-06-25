const User = require("../models/userSchame");
const bcrypt = require("bcryptjs");

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(username, email, hashedPassword) {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  async comparePasswords(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = new UserRepository();
