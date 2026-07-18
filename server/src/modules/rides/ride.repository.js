/**
 * ride.repository.js
 * ------------------
 * THE ONLY file that imports the Ride model directly.
 * All other layers access the DB through this file — no exceptions.
 */

const Ride = require('./ride.model');

/**
 * Create a new ride document.
 * @param {Object} data
 * @returns {Promise<Ride>}
 */
const createRide = async (data) => {
  const ride = new Ride(data);
  return ride.save();
};

/**
 * Find a ride by its Mongo _id.
 * Optionally populate the driver field for response shaping.
 * @param {string} id
 * @param {boolean} [populateDriver=false]
 * @returns {Promise<Ride|null>}
 */
const findRideById = async (id, populateDriver = false) => {
  const query = Ride.findById(id);
  if (populateDriver) {
    query.populate('driver', 'name email averageRating totalRatings profilePhoto');
  }
  return query.exec();
};

/**
 * List rides with optional filters and pagination.
 * Only returns non-cancelled rides by default.
 *
 * @param {Object} filters
 * @param {string}  [filters.status]       - 'open'|'full'|'completed'
 * @param {string}  [filters.origin]       - case-insensitive substring match
 * @param {string}  [filters.destination]  - case-insensitive substring match
 * @param {string}  [filters.date]         - ISO date string (matches that calendar day)
 * @param {number}  [filters.minSeats=1]   - minimum availableSeats
 * @param {number}  [page=1]
 * @param {number}  [limit=20]
 * @returns {Promise<{rides: Ride[], total: number, page: number, totalPages: number}>}
 */
const listRides = async (filters = {}, page = 1, limit = 20) => {
  const query = {};

  // Default: exclude cancelled rides unless explicitly requested
  query.status = filters.status || { $in: ['open', 'full'] };

  if (filters.origin) {
    query.origin = { $regex: filters.origin, $options: 'i' };
  }
  if (filters.destination) {
    query.destination = { $regex: filters.destination, $options: 'i' };
  }
  if (filters.date) {
    // Match any time within the given calendar day (UTC)
    const start = new Date(filters.date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(filters.date);
    end.setUTCHours(23, 59, 59, 999);
    query.departureTime = { $gte: start, $lte: end };
  }
  if (filters.minSeats) {
    query.availableSeats = { $gte: Number(filters.minSeats) };
  }

  const skip = (page - 1) * limit;

  const [rides, total] = await Promise.all([
    Ride.find(query)
      .populate('driver', 'name email averageRating profilePhoto')
      .sort({ departureTime: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Ride.countDocuments(query),
  ]);

  return {
    rides,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Update specific fields on a ride by id.
 * Returns the updated document.
 * @param {string} id
 * @param {Object} updateFields
 * @returns {Promise<Ride|null>}
 */
const updateRideById = async (id, updateFields) => {
  return Ride.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  }).populate('driver', 'name email averageRating profilePhoto');
};

/**
 * Atomically decrement availableSeats by 1.
 * Used by the Requests module when accepting a request.
 * Returns the updated document (so caller can check new availableSeats).
 * @param {string} id
 * @returns {Promise<Ride|null>}
 */
const decrementAvailableSeats = async (id) => {
  return Ride.findByIdAndUpdate(
    id,
    { $inc: { availableSeats: -1 } },
    { new: true }
  );
};

/**
 * Atomically decrement availableSeats by 1 ONLY if seats > 0.
 * Returns the updated document, or null if no seats were available
 * (meaning another concurrent request raced to the last seat first).
 * This closes the race condition under concurrent accepts.
 * @param {string} id
 * @returns {Promise<Ride|null>}
 */
const decrementAvailableSeatsAtomic = async (id) => {
  return Ride.findOneAndUpdate(
    { _id: id, availableSeats: { $gt: 0 } },
    { $inc: { availableSeats: -1 } },
    { new: true }
  );
};

/**
 * Atomically increment availableSeats by 1.
 * Used by the Requests module when a previously-accepted request is withdrawn/rejected.
 * @param {string} id
 * @returns {Promise<Ride|null>}
 */
const incrementAvailableSeats = async (id) => {
  return Ride.findByIdAndUpdate(
    id,
    { $inc: { availableSeats: 1 } },
    { new: true }
  );
};

/**
 * Set the ride status directly.
 * Used for status transitions (open→cancelled, open→completed, etc.).
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Ride|null>}
 */
const setRideStatus = async (id, status) => {
  return Ride.findByIdAndUpdate(id, { status }, { new: true });
};

/**
 * Get all rides created by a specific driver.
 * @param {string} driverId
 * @returns {Promise<Ride[]>}
 */
const findRidesByDriver = async (driverId) => {
  return Ride.find({ driver: driverId }).sort({ departureTime: -1 }).lean();
};

/**
 * Bulk updates the status of rides that have passed their departure time.
 * @param {Date} currentTime Evaluated time for expiration
 * @returns {Promise<number>} Number of rides closed
 */
const closeExpiredRides = async (currentTime) => {
  const result = await Ride.updateMany(
    {
      status: { $in: ['open', 'full'] },
      departureTime: { $lt: currentTime },
    },
    { $set: { status: 'closed' } }
  );
  return result.modifiedCount;
};

/**
 * Bulk updates the status of rides that have passed their departure time by a certain buffer to completed.
 * @param {Date} currentTime Evaluated time for expiration
 * @param {number} bufferHours Number of hours past departureTime
 * @returns {Promise<number>} Number of rides completed
 */
const completeClosedRides = async (currentTime, bufferHours) => {
  const cutoffTime = new Date(currentTime.getTime() - (bufferHours * 60 * 60 * 1000));
  const result = await Ride.updateMany(
    {
      status: 'closed',
      departureTime: { $lt: cutoffTime },
    },
    { $set: { status: 'completed' } }
  );
  return result.modifiedCount;
};

module.exports = {
  createRide,
  findRideById,
  listRides,
  updateRideById,
  decrementAvailableSeats,
  decrementAvailableSeatsAtomic,
  incrementAvailableSeats,
  setRideStatus,
  findRidesByDriver,
  closeExpiredRides,
  completeClosedRides,
};
