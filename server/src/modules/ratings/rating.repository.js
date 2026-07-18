const Rating = require('./rating.model');
const mongoose = require('mongoose');

/**
 * Persists a new rating document.
 */
const createRating = async (data) => {
  const rating = new Rating(data);
  return rating.save();
};

/**
 * Returns a paginated list of ratings a user has received.
 */
const getRatingsForUser = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const [ratings, total] = await Promise.all([
    Rating.find({ rateeId: userId })
      .populate('raterId', 'name profilePhoto')
      .populate('rideId', 'origin destination departureTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Rating.countDocuments({ rateeId: userId }),
  ]);

  return {
    ratings,
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Computes the aggregate average score and count for a user via Mongo aggregation pipeline.
 */
const getAggregateRating = async (userId) => {
  const aggregateResult = await Rating.aggregate([
    { $match: { rateeId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$rateeId',
        averageScore: { $avg: '$score' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (aggregateResult.length > 0) {
    return {
      averageScore: Number(aggregateResult[0].averageScore.toFixed(2)),
      count: aggregateResult[0].count,
    };
  }

  return { averageScore: 0, count: 0 };
};

/**
 * Finds an existing rating by index fields to avoid duplicates.
 */
const findExistingRating = async (rideId, raterId, rateeId) => {
  return Rating.findOne({ rideId, raterId, rateeId }).exec();
};

module.exports = {
  createRating,
  getRatingsForUser,
  getAggregateRating,
  findExistingRating,
};
