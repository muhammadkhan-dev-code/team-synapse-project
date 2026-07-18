const express = require('express');
const router = express.Router();

const ratingController = require('./rating.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');

const {
  submitRatingSchema,
  rideIdParamSchema,
  userIdParamSchema,
  historyQuerySchema,
} = require('./rating.validator');

/**
 * GET /api/v1/users/:userId/rating-summary
 * Public route to view aggregate user rating profile stats
 */
router.get(
  '/users/:userId/rating-summary',
  validate(userIdParamSchema, 'params'),
  ratingController.getUserProfile
);

/**
 * Below routes require authentication
 */
router.use(authenticate);

/**
 * POST /api/v1/rides/:rideId/ratings
 * Submit a mutual rating for a completed ride.
 */
router.post(
  '/rides/:rideId/ratings',
  validate(rideIdParamSchema, 'params'),
  validate(submitRatingSchema, 'body'),
  ratingController.submitRating
);

/**
 * GET /api/v1/users/:userId/ride-history
 * View private ride history (must be account owner).
 */
router.get(
  '/users/:userId/ride-history',
  validate(userIdParamSchema, 'params'),
  validate(historyQuerySchema, 'query'),
  ratingController.getRideHistory
);

module.exports = router;
