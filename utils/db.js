"use strict";

const Secrets = require("./secrets");

class DB {
  constructor(dbSecretId) {
    this.dbSecretId = dbSecretId;
    this.connection = this.conn();
  }

  async conn() {
    if (!this.connection) {
      const secrets = new Secrets();
      const dbInfo = await secrets.fetchSecret(this.dbSecretId);
      const connection = require("knex")({
        client: dbInfo.engine,
        connection: {
          host: dbInfo.host,
          port: dbInfo.port,
          database: dbInfo.dbname,
          user: dbInfo.username,
          password: dbInfo.password
        }
      });
      return connection;
    } else return this.connection;
  }
}

module.exports = DB;
