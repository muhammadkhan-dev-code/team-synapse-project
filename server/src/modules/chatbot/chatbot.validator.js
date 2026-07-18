const Joi = require('joi');

const sendMessageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(1000).required().messages({
    'any.required': 'Message is required',
    'string.empty': 'Message cannot be empty',
    'string.max': 'Message cannot exceed 1000 characters',
  }),
  conversationId: Joi.string().trim().max(100).optional(),
});

module.exports = {
  sendMessageSchema,
};
