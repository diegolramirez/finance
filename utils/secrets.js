"use strict";

const AWS = require("aws-sdk");

class Secrets {
  constructor() {
    this.secretsManager = new AWS.SecretsManager({
      region: process.env.AWS_REGION
    });
  }

  async fetchSecret(secretId) {
    try {
      const data = await this.secretsManager
        .getSecretValue({
          SecretId: secretId
        })
        .promise();

      if (data) {
        if (data.SecretString) {
          const secret = data.SecretString;
          const parsedSecret = JSON.parse(secret);
          return parsedSecret;
        }
        const binarySecretData = data.SecretBinary;
        return binarySecretData;
      }
    } catch (error) {
      console.log("Error retrieving secrets");
      console.log(error);
    }
  }
}

module.exports = Secrets;
