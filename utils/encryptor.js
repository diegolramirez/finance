"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class Encryptor {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    console.log(salt);
    console.log(password);
    const encryptedPassword = await bcrypt.hash(password, salt);
    console.log(encryptedPassword);
    return encryptedPassword;
  }

  async checkPasswords(inputPassword, encryptedPassword) {
    const res = await bcrypt.compare(inputPassword, encryptedPassword);
    console.log(res);
    return res;
  }

  generateToken(userId) {
    return jwt.sign({userId}, process.env.TOKEN_SECRET);
  }
}

module.exports = Encryptor;
