const Joi = require('joi');

const addUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required()
    .messages({
      "string.min": "firstName must be at least 2 characters",
      "string.max": "firstName cannot exceed 20 characters",
      "any.required": "firstName is required",
    }),

  lastName: Joi.string().min(2).max(50).required()
    .messages({
      "string.min": "lastName must be at least 2 characters",
      "string.max": "lastName cannot exceed 20 characters",
      "any.required": "lastName is required",
    }),
    role: Joi.string().valid("admin", "student", "mentor", "parent").required()
    .messages({
        "any.required": "role is required",
      }),

  email: Joi.string()
    .email({ tlds: { allow: false } }).required()
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
    addUserSchema
}