const Joi = require("joi");


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|info)$/;

const addMentorSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": "firstname must be at least 2 characters",
      "string.max": "firstname cannot exceed 50 characters",
      "any.required": "firstname is required",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": "lastname must be at least 2 characters",
      "string.max": "lastname cannot exceed 50 characters",
      "any.required": "lastname is required",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) 
    .pattern(emailRegex) 
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.pattern.base": "Only common domains (com, net, org, edu, gov, mil, info) are allowed",
      "any.required": "email is required",
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.min": "password must be at least 6 characters",
      "string.max": "password cannot exceed 30 characters",
      "any.required": "password is required",
    }),
});





module.exports = { 
  addMentorSchema
 };
