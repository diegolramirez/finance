"use strict";

// const axios = require("axios");
const DB = require("../../utils/db");

class Model extends DB {
  constructor() {
    super(process.env.AWS_SECRET_DB);
  }

  helloWorld(str) {
    return str || "Hello World!";
  }

  async customer(customerId) {
    const conn_ = await this.conn();
    return await conn_
      .select()
      .table("customer")
      .where("customer_id", customerId);
  }
}

module.exports = Model;
