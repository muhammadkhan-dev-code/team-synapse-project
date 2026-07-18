/**
 * request.repository.js
 * ---------------------
 * THE ONLY file that imports the RideRequest model directly.
 * All other layers in this module access the DB through this file.
 */

const RideRequest = require('./rideRequest.model');

/**
 * Create a new ride request document.
 * Includes an initial 'pending' entry in statusHistory for audit trail.
 * @param {Object} data  - { riderId, rideId }
 * @returns {Promise<RideRequest>}
 */
const createRequest = async ({ riderId, rideId }) => {
  const request = new RideRequest({
    riderId,
    rideId,
    status: 'pending',
    statusHistory: [{ status: 'pending', changedAt: new Date() }],
  });
  return request.save();
};

/**
 * Find a single request by its Mongo _id.
 * @param {string} id
 * @returns {Promise<RideRequest|null>}
 */
const findRequestById = async (id) => {
  return RideRequest.findById(id)
    .populate('riderId', 'name email')
    .populate('rideId', 'origin destination departureTime driver availableSeats status');
};

/**
 * Find a request by (riderId, rideId) — used for duplicate check.
 * @param {string} riderId
 * @param {string} rideId
 * @returns {Promise<RideRequest|null>}
 */
const findExistingRequest = async (riderId, rideId) => {
  return RideRequest.findOne({ riderId, rideId });
};

/**
 * List all requests for a specific ride (owner's view).
 * @param {string} rideId
 * @param {Object} filters         - { status }
 * @param {number} [page=1]
 * @param {number} [limit=20]
 * @returns {Promise<{requests, total, page, totalPages}>}
 */
const listRequestsByRide = async (rideId, filters = {}, page = 1, limit = 20) => {
  const query = { rideId };
  if (filters.status) query.status = filters.status;

  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    RideRequest.find(query)
      .populate('riderId', 'name email profilePhoto averageRating')
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    RideRequest.countDocuments(query),
  ]);

  return { requests, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * List all requests sent by a specific rider (rider's view).
 * @param {string} riderId
 * @param {Object} filters  - { status }
 * @param {number} [page=1]
 * @param {number} [limit=20]
 * @returns {Promise<{requests, total, page, totalPages}>}
 */
const listRequestsByRider = async (riderId, filters = {}, page = 1, limit = 20) => {
  const query = { riderId };
  if (filters.status) query.status = filters.status;

  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    RideRequest.find(query)
      .populate('rideId', 'origin destination departureTime driver availableSeats status')
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    RideRequest.countDocuments(query),
  ]);

  return { requests, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * Update the status of a request and append a timestamped entry to statusHistory.
 * Atomic: uses findByIdAndUpdate, not read-then-save.
 * @param {string} id      - Request _id
 * @param {string} status  - New status value ('accepted' | 'rejected')
 * @returns {Promise<RideRequest|null>}
 */
const updateRequestStatus = async (id, status) => {
  return RideRequest.findByIdAndUpdate(
    id,
    {
      $set: { status },
      $push: { statusHistory: { status, changedAt: new Date() } },
    },
    { new: true, runValidators: true }
  )
    .populate('riderId', 'name email')
    .populate('rideId', 'origin destination departureTime driver availableSeats status');
};

module.exports = {
  createRequest,
  findRequestById,
  findExistingRequest,
  listRequestsByRide,
  listRequestsByRider,
  updateRequestStatus,
};
