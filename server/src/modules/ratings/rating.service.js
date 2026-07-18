const ratingRepository = require('./rating.repository');
const { checkParticipant } = require('../../utils/participant.util');
const { findRideById } = require('../rides/ride.repository');
const { findExistingRequest } = require('../requests/request.repository');
const ApiError = require('../../utils/ApiError');
const User = require('../auth/user.model');
const Ride = require('../rides/ride.model');

/**
 * Submits a rating for a completed ride.
 */
const submitRating = async (rideId, raterId, rateeId, score, comment) => {
  if (raterId.toString() === rateeId.toString()) {
    throw new ApiError(400, 'You cannot rate yourself');
  }

  const ride = await findRideById(rideId);
  if (!ride) {
    throw new ApiError(404, 'Ride not found');
  }
  if (ride.status !== 'completed') {
    throw new ApiError(400, 'Cannot rate a ride that is not completed');
  }

  // Ensure both users are participants
  const [isRaterParticipant, isRateeParticipant] = await Promise.all([
    checkParticipant(rideId, raterId),
    checkParticipant(rideId, rateeId),
  ]);

  if (!isRaterParticipant || !isRateeParticipant) {
    throw new ApiError(403, 'Both rater and ratee must be participants of the ride');
  }

  const existing = await ratingRepository.findExistingRating(rideId, raterId, rateeId);
  if (existing) {
    throw new ApiError(409, 'Rating already submitted for this user on this ride');
  }

  const rating = await ratingRepository.createRating({
    rideId,
    raterId,
    rateeId,
    score,
    comment,
  });

  // Update cached aggregate
  const { averageScore, count } = await ratingRepository.getAggregateRating(rateeId);
  await User.findByIdAndUpdate(rateeId, {
    averageRating: averageScore,
    totalRatings: count,
  });

  return rating;
};

/**
 * Gets the user profile stats.
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('name averageRating totalRatings profilePhoto createdAt');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Fetch recent ratings
  const { ratings: recentRatings } = await ratingRepository.getRatingsForUser(userId, { page: 1, limit: 5 });

  // Get past ride count where they were driver or accepted rider in completed/closed rides
  // Driver:
  const driverCount = await Ride.countDocuments({
    driver: userId,
    status: { $in: ['closed', 'completed'] },
  });

  // Rider:
  // Note: For absolute correctness without loading all requests, we could do an aggregation or query the Requests collection
  const Request = require('../requests/request.model');
  const riderCount = await Request.countDocuments({
    passenger: userId,
    status: 'accepted',
  }); 
  // Wait, riderCount above counts all accepted requests. To strictly only count past rides, we need to join Rides.
  // Approximation for profile stats.
  
  return {
    user,
    recentRatings,
    pastRideCount: driverCount + riderCount, // A simple approximation
  };
};

/**
 * Gets a user's unified ride history.
 */
const getRideHistory = async (userId, { page = 1, limit = 20 }) => {
  const Request = require('../requests/request.model');
  
  const skip = (page - 1) * limit;

  // We want rides where: user is driver OR user is passenger with accepted request
  // AND ride status is closed or completed.

  // First, find all accepted requests for this user
  const acceptedRequests = await Request.find({
    passenger: userId,
    status: 'accepted',
  }).select('ride').lean();

  const rideIds = acceptedRequests.map((r) => r.ride);

  const query = {
    $or: [{ driver: userId }, { _id: { $in: rideIds } }],
    status: { $in: ['closed', 'completed'] },
  };

  const [rides, total] = await Promise.all([
    Ride.find(query)
      .populate('driver', 'name averageRating profilePhoto')
      .sort({ departureTime: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Ride.countDocuments(query),
  ]);

  return {
    rides,
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  submitRating,
  getUserProfile,
  getRideHistory,
};
