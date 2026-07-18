/**
 * auth.validator.js
 * -----------------
 * Joi schemas for every auth route.
 * Wired through the existing validate() middleware.
 */

const Joi = require('joi');

/** Common password rules — reused across schemas */
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .required()
  .messages({
    'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 128 characters',
    'any.required': 'Password is required',
  });

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 80 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required().messages({
    'string.email': 'A valid email address is required',
    'any.required': 'Email is required',
  }),
  password: passwordSchema,
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required(),
  otp: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only digits',
      'any.required': 'OTP is required',
    }),
});

const resendOtpSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).lowercase().required(),
  password: Joi.string().required().messages({ 'any.required': 'Password is required' }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).optional(),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-()]{7,20}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Phone number format is invalid',
    }),
  profilePhoto: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Profile photo must be a valid URL',
  }),
}).min(1); // at least one field required for an update

module.exports = {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
};
