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
  //
  // async queryPG(query, parameters) {
  //   // console.log("queryPG -", query);
  //   try {
  //     let rows = await this.connectionPG.raw(query, parameters);
  //     rows = rows.rows.length > 0 ? rows.rows : [];
  //     return rows;
  //   } catch (error) {
  //     console.log("queryPG -", error);
  //     throw error;
  //   }
  // }
  //
  // async updatePG(query, parameters) {
  //   // console.log(query);
  //   try {
  //     let rows = await this.connectionPG.raw(query, parameters);
  //     return rows.rowCount;
  //   } catch (error) {
  //     console.log("updatePG -", error);
  //     throw error;
  //   }
  // }
}

module.exports = DB;
