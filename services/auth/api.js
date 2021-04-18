"use strict";

const status = require("http-status");
const Model = require("./model");
const { loginValidator } = require("./validator");
const checkToken = require("../../middlewares/checkToken");

module.exports = async function(app, prefix) {
  const model = new Model();
  console.log(prefix);

  app.post(prefix + "/login", async (req, res) => {
    const { error } = loginValidator(req.body);
    if (error) return res.status(status.BAD_REQUEST).json(error.details);

    try {
      const token = await model.login(req.body.email, req.body.password);
      res.status(status.OK).json(token);
    } catch (err) {
      console.log(err);
      res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
    }
    return res;
  });

  app.post(prefix + "/token", (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken === null || refreshToken === undefined)
      return res.status(status.UNAUTHORIZED).json("Empty token");
    try {
      const token = model.token(refreshToken);
      res.status(status.OK).json(token);
    } catch (err) {
      if (err.message === "Forbidden")
        res.status(status.FORBIDDEN).json(err.message);
      else if (err.message === "jwt malformed")
        res.status(status.BAD_REQUEST).json(err);
      else {
        console.log(err);
        res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
      }
    }
    return res;
  });

  app.delete(prefix + "/logout", (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken === null || refreshToken === undefined)
      return res.status(status.UNAUTHORIZED).json("Empty token");
    try {
      model.logout(refreshToken);
      res.status(status.NO_CONTENT).json();
    } catch (err) {
      if (err.message === "Bad Requestt")
        res.status(status.BAD_REQUEST).json("No active session");
      else {
        console.log(err);
        res.status(status.INTERNAL_SERVER_ERROR).json(err.message);
      }
    }
    return res;
  });
};
