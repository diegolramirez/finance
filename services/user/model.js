"use strict";

// const axios = require("axios");
const DB = require("../../utils/db");
const Encryptor = require("../../utils/encryptor");

class Model extends DB {
  constructor() {
    super(process.env.AWS_SECRET_DB);
    this.encryptor = new Encryptor();
  }

  async find(params) {
    const conn_ = await this.conn();
    const { id, email } = params;
    let user;
    if (id) {
      user = await conn_
        .select()
        .table("customer")
        .where("customer_id", id);
    } else if (email) {
      user = await conn_
        .select()
        .table("customer")
        .where("email", email);
    } else user = [];
    return user.length ? user[0] : null;
  }

  async register(user) {
    const conn_ = await this.conn();
    const userFound = await this.find({ email: user.email });
    if (userFound) throw new Error("User already exists");
    user.password = await this.encryptor.encryptPassword(user.password);
    return await conn_("customer").insert({
      email: user.email,
      password: user.password,
      display_name: user.name,
      role_id: user.role_id
    });
  }
}

module.exports = Model;
