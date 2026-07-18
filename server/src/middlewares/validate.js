const ApiError = require('../utils/ApiError');

/**
 * Validation middleware factory.
 * @param {Object} schema  - Joi schema
 * @param {string} [target='body'] - which part of req to validate: 'body' | 'query' | 'params'
 */
const validate = (schema, target = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true, // silently drop unknown fields; also applies Joi defaults
  });
  if (error) {
    const details = error.details.map((d) => d.message);
    return next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', details));
  }
  // Write back validated + defaulted value so controllers get clean data
  req[target] = value;
  next();
};

module.exports = validate;
