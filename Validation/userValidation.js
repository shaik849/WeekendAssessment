const joi = require("joi");

const authSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().required(),
  firstName: joi.string().alphanum().min(3).max(30).required(),
  lastName: joi.string().alphanum().min(3).max(30).required(),
});

module.exports = { authSchema };
