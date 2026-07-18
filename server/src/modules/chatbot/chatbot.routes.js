const express = require('express');
const router = express.Router();

const chatbotController = require('./chatbot.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const { sendMessageSchema } = require('./chatbot.validator');
const rateLimit = require('express-rate-limit');

// Chat bot rate limiter: 5 requests per 2 minutes per user.
const chatLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many queries to the AI Assistant. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id || req.user.sub,
});

router.use(authenticate);

/**
 * POST /api/v1/chatbot/message
 * Interact with the UniRideSync AI Assistant
 */
router.post(
  '/chatbot/message',
  chatLimiter,
  validate(sendMessageSchema, 'body'),
  chatbotController.sendMessage
);

module.exports = router;
