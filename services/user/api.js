"use strict";

const status = require("http-status");
const Model = require("./model");

module.exports = async function(app, prefix) {
  const model = new Model();
  console.log(prefix);

  /**
   * @swagger
   * /api/user/register:
   *   post:
   *     description: Register a user.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: User registered.
   *       500:
   *         description: API failed unexpectedly.
   */
  app.post(prefix + "/register", async (req, res) => {
    try {
      const user = await model.register(req.body);
      console.log(user);
      res.status(status.OK).json(user);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });

  app.get(prefix + "/:id", async (req, res) => {
    try {
      const user = await model.find({id: req.params.id});
      if (!user) res.status(status.NOT_FOUND).json("user not found");
      else res.status(status.OK).json(user);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });

  app.get(prefix + "by_email/:email", async (req, res) => {
    try {
      const user = await model.find({email: req.params.email});
      if (!user) res.status(status.NOT_FOUND).json("user not found");
      else res.status(status.OK).json(user);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });
};
