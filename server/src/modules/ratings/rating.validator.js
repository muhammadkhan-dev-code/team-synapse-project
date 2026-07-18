const Joi = require('joi');
const { isValidObjectId } = require('mongoose');

// Custom validation for MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const submitRatingSchema = Joi.object({
  rateeId: Joi.string().custom(objectIdValidator, 'Object Id Validation').required().messages({
    'any.required': 'Ratee ID is required',
    'any.invalid': 'Invalid Ratee ID format',
  }),
  score: Joi.number().integer().min(1).max(5).required().messages({
    'any.required': 'Score is required',
    'number.base': 'Score must be a number',
    'number.integer': 'Score must be an integer',
    'number.min': 'Score must be at least 1',
    'number.max': 'Score cannot exceed 5',
  }),
  comment: Joi.string().max(500).allow('', null).messages({
    'string.max': 'Comment cannot exceed 500 characters',
  }),
});

const rideIdParamSchema = Joi.object({
  rideId: Joi.string().custom(objectIdValidator, 'Object Id Validation').required().messages({
    'any.required': 'Ride ID is required',
    'any.invalid': 'Invalid Ride ID format',
  }),
});

const userIdParamSchema = Joi.object({
  userId: Joi.string().custom(objectIdValidator, 'Object Id Validation').required().messages({
    'any.required': 'User ID is required',
    'any.invalid': 'Invalid User ID format',
  }),
});

const historyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = {
  submitRatingSchema,
  rideIdParamSchema,
  userIdParamSchema,
  historyQuerySchema,
};
