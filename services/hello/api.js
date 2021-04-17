"use strict";

const status = require("http-status");
const Model = require("./model");

module.exports = async function(app, prefix) {
  const model = new Model();
  console.log(prefix);

  /**
   * @swagger
   * /finance/hello/text/:
   *   get:
   *     description: Returns hello message.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Message returned.
   *       500:
   *         description: API failed unexpectedly.
   */
  app.get(prefix + "/text/:text?", (req, res) => {
    try {
      const text = model.helloWorld(req.params.text);
      console.log(text);
      res.status(status.OK).json(text);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });

  app.get(prefix + "/customer/:customerId", async (req, res) => {
    try {
      const customer = await model.customer(req.params.customerId);
      console.log(customer);
      console.log(!customer);
      console.log(!!customer);
      if (!!customer) res.status(status.NOT_FOUND).json("customer not found");
      else res.status(status.OK).json(customer);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });
};
