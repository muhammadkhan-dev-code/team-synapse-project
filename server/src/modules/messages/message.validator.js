const Joi = require('joi');

const createMessageSchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required().messages({
    'string.base': 'Text must be a string',
    'string.empty': 'Text cannot be empty',
    'string.min': 'Text cannot be empty',
    'string.max': 'Text cannot exceed 1000 characters',
    'any.required': 'Text is required',
  }),
});

const getThreadSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
});

module.exports = {
  createMessageSchema,
  getThreadSchema,
};
