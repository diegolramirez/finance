"use strict";

// const axios = require("axios");
const Encryptor = require("../../utils/encryptor");
const User = require("../user/model");

class Model {
  constructor() {
    this.encryptor = new Encryptor();
    this.user = new User();
    this.refreshTokens = {};
  }

  async login(email, password) {
    const userFound = await this.user.find({ email });
    if (!userFound) throw new Error("Email not found");

    const validPassword = await this.encryptor.checkPasswords(
      password,
      userFound.password
    );
    if (!validPassword) throw new Error("Wrong password");

    const { accessToken, expiresIn } = this.encryptor.generateAccessToken(
      userFound.customer_id,
      userFound.role_id
    );
    const refreshToken = this.encryptor.generateRefreshToken(
      userFound.customer_id,
      userFound.role_id
    );

    this.refreshTokens[userFound.customer_id] = refreshToken;

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn,
      refreshToken
    };
  }

  token(refreshToken) {
    const decoded = this.encryptor.verifyRefreshToken(refreshToken);
    const foundToken = this.refreshTokens[decoded.id];
    if (!foundToken || foundToken !== refreshToken)
      throw new Error("Forbidden");
    const { accessToken, expiresIn } = this.encryptor.generateAccessToken(
      decoded.id,
      decoded.role
    );
    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn,
      refreshToken
    };
  }

  logout(refreshToken) {
    const decoded = this.encryptor.verifyRefreshToken(refreshToken);
    const foundToken = this.refreshTokens[decoded.id];
    if (!foundToken || foundToken !== refreshToken)
      throw new Error("Bad Requestt");
    delete this.refreshTokens[decoded.id];
  }
}

module.exports = Model;
