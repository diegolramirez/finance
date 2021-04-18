"use strict";

const jwt = require("jsonwebtoken");
const status = require("http-status");

function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) res.status(status.UNAUTHORIZED).json("Not authorized");
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(status.BAD_REQUEST).json("Invalidad token");
  }
}

module.exports = auth;
