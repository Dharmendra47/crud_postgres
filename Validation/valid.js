const Joi = require("joi");

exports.register = Joi.object().keys({
  email: Joi.string().required().trim(),
  name: Joi.string().min(3).required().trim(),
  password: Joi.string().min(5).required().trim(),
  city: Joi.string().required().trim(),
  role: Joi.string().required().trim().valid("user", "admin"),
});

exports.login = Joi.object().keys({
  email: Joi.string().required().trim(),
  password: Joi.string().required().trim(),
});
