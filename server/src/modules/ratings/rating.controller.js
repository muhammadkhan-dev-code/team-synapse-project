const ratingService = require('./rating.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * @desc   Submit a rating for a ride participant
 * @route  POST /api/v1/rides/:rideId/ratings
 */
const submitRating = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const { rateeId, score, comment } = req.body;
  const raterId = req.user.id || req.user.sub;

  const rating = await ratingService.submitRating(rideId, raterId, rateeId, score, comment);

  res.status(201).json(new ApiResponse(201, rating, 'Rating submitted successfully'));
});

/**
 * @desc   Fetch user public profile & aggregate stats
 * @route  GET /api/v1/users/:userId/rating-summary
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const profile = await ratingService.getUserProfile(userId);
  res.status(200).json(new ApiResponse(200, profile, 'User profile fetched successfully'));
});

/**
 * @desc   Fetch a user's past ride history
 * @route  GET /api/v1/users/:userId/ride-history
 */
const getRideHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page, limit } = req.query;

  // Security check: Only the account owner can view their private ride history
  const actingUserId = req.user.id || req.user.sub;
  if (actingUserId !== userId) {
    res.status(403).json(new ApiResponse(403, null, "You are not authorized to view this user's ride history"));
    return;
  }

  const history = await ratingService.getRideHistory(userId, { page, limit });
  res.status(200).json(new ApiResponse(200, history, 'Ride history fetched successfully'));
});

module.exports = {
  submitRating,
  getUserProfile,
  getRideHistory,
};
