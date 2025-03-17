const Joi = require("joi");


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|info)$/;

const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "any.required": "First name is required",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "any.required": "Last name is required",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) 
    .pattern(emailRegex) 
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.pattern.base": "Only common domains (com, net, org, edu, gov, mil, info) are allowed",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password cannot exceed 30 characters",
      "any.required": "Password is required",
    }),
});


const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(emailRegex)
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.pattern.base": "Only common domains (com, net, org, edu, gov, mil, info) are allowed",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password cannot exceed 30 characters",
      "any.required": "Password is required",
    }),
});

module.exports = { registerSchema, loginSchema };
