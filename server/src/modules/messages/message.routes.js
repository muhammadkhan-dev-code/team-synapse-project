/**
 * message.routes.js
 * -----------------
 * Route declarations for ride message threads.
 * Mounted at /api/v1 in app.js
 */

const express = require('express');
const router = express.Router();

const messageController = require('./message.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');

const {
  createMessageSchema,
  getThreadSchema,
} = require('./message.validator');
const rateLimit = require('express-rate-limit');

const messageLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 20, 
  message: { success: false, message: 'Too many messages sent. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,
});

// All message routes require a valid access token
router.use(authenticate);

/**
 * POST /api/v1/rides/:rideId/messages
 * FR-5.x — Send a message to the ride's conversation thread
 */
router.post(
  '/rides/:rideId/messages',
  messageLimiter,
  validate(createMessageSchema), // body validation defaults to body in validate middleware
  messageController.sendMessage
);

/**
 * GET /api/v1/rides/:rideId/messages
 * FR-5.x — List messages for a ride (chronologically)
 */
router.get(
  '/rides/:rideId/messages',
  validate(getThreadSchema, 'query'),
  messageController.getThread
);

module.exports = router;
