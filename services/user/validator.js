"use strict";

const Joi = require("joi");

const registerValidator = data => {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2
      })
      .required()
  });
  return schema.validate(data);
};

const loginValidator = data => {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2
      })
      .required()
  });
  return schema.validate(data);
};

module.exports = {registerValidator, loginValidator};
