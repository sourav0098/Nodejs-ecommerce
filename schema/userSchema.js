const Joi = require("joi");
const REGEX_VALIDATIONS = require("../utils/regex");

const userSchema = Joi.object({
  fname: Joi.string().required().min(2).max(50).messages({
    "string.base": `Please provide a valid first name`,
    "string.empty": `Please provide a first name`,
    "string.min": `First name should have a minimum length of {#limit}.`,
    "string.max": `First name should have a maximum length of {#limit}.`,
    "any.required": `Please provide a first name`,
  }),
  lname: Joi.string().required().min(2).max(50).messages({
    "string.base": `Please provide a valid last name`,
    "string.empty": `Please provide a last name`,
    "string.min": `Last name should have a minimum length of {#limit}.`,
    "string.max": `Last name should have a maximum length of {#limit}.`,
    "any.required": `Please provide a last name`,
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.base": `Please provide a valid email`,
    "string.empty": `Please provide an email`,
    "string.email": `Please provide a valid email`,
    "any.required": `Please provide an email`,
  }),
  password: Joi.string()
    .pattern(new RegExp(REGEX_VALIDATIONS.PASSWORD))
    .required()
    .messages({
      "string.base": `Please provide a valid password`,
      "string.empty": `Please provide a password`,
      "string.pattern.base": `Password must have atleast one lowercase character, one uppercase character, one digit, one special character and minimum length of 8 characters`,
      "any.required": `Please provide a password`,
    }),
  mobile: Joi.string()
    .pattern(new RegExp(REGEX_VALIDATIONS.PHONE))
    .required()
    .messages({
      "string.base": `Please provide a valid mobile number`,
      "string.empty": `Please provide a mobile number`,
      "string.pattern.base": `Mobile number must be 10 digits long`,
      "any.required": `Please provide a mobile number`,
    }),
});

module.exports = userSchema;
