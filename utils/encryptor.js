"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class Encryptor {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async checkPasswords(inputPassword, encryptedPassword) {
    return await bcrypt.compare(inputPassword, encryptedPassword);
  }

  generateAccessToken(id, role, expiresIn = 15 * 60) {
    const accessToken = jwt.sign(
      { id, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn }
    );

    return { accessToken, expiresIn };
  }

  generateRefreshToken(id, role) {
    return jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET);
  }

  verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  }
}

module.exports = Encryptor;
