"use strict";

const Joi = require("joi");

const loginValidator = data => {
  const schema = Joi.object({
    password: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2
      })
      .required()
  });
  return schema.validate(data);
};

module.exports = { loginValidator };
