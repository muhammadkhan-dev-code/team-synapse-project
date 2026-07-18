/**
 * ride.service.js
 * ---------------
 * ALL business logic for the Rides module lives here.
 * No Mongoose imports, no HTTP-layer concerns.
 * Services call repositories, not models.
 */

const rideRepository = require('./ride.repository');
const ApiError = require('../../utils/ApiError');
const ERROR = require('../../errors/errorCodes');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Assert that a ride exists. Throws 404 if not found.
 * @param {string} id
 * @param {boolean} [populateDriver=false]
 * @returns {Promise<Ride>}
 */
const getRideOrThrow = async (id, populateDriver = false) => {
  const ride = await rideRepository.findRideById(id, populateDriver);
  if (!ride) {
    throw new ApiError(404, 'Ride not found', ERROR.RIDE_NOT_FOUND);
  }
  return ride;
};

/**
 * Assert that the requesting user is the ride's driver.
 * @param {Ride} ride
 * @param {string} userId
 */
const assertIsDriver = (ride, userId) => {
  if (ride.driver._id ? ride.driver._id.toString() : ride.driver.toString() !== userId) {
    throw new ApiError(403, 'Only the ride driver can perform this action', ERROR.NOT_RIDE_OWNER);
  }
};

/**
 * Assert ride is still in a state where passengers can join.
 * @param {Ride} ride
 */
const assertRideIsOpen = (ride) => {
  if (ride.status !== 'open') {
    throw new ApiError(400, `Ride is ${ride.status} and cannot be modified`, ERROR.RIDE_NOT_OPEN);
  }
};

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * FR-2.1: Create a new ride. The authenticated user becomes the driver.
 * @param {string} driverId  - from req.user.sub
 * @param {Object} data      - validated body fields
 */
const createRide = async (driverId, data) => {
  // Reject rides scheduled in the past
  if (new Date(data.departureTime) <= new Date()) {
    throw new ApiError(400, 'Departure time must be in the future', ERROR.VALIDATION_ERROR);
  }

  const ride = await rideRepository.createRide({ driver: driverId, ...data });
  return ride;
};

/**
 * FR-2.2: List/search available rides with filters and pagination.
 * @param {Object} query  - filter params from req.query
 */
const listRides = async (query) => {
  const {
    status,
    origin,
    destination,
    date,
    minSeats,
    page = 1,
    limit = 20,
  } = query;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20)); // cap at 50

  return rideRepository.listRides(
    { status, origin, destination, date, minSeats },
    parsedPage,
    parsedLimit
  );
};

/**
 * FR-2.3: Get a single ride by ID, populating driver details.
 * @param {string} rideId
 */
const getRideById = async (rideId) => {
  return getRideOrThrow(rideId, true);
};

/**
 * FR-2.4: Update ride details. Only the driver can do this.
 * Edits are only permitted while the ride is 'open'.
 * @param {string} rideId
 * @param {string} userId   - from req.user.sub
 * @param {Object} updates  - validated body fields
 */
const updateRide = async (rideId, userId, updates) => {
  const ride = await getRideOrThrow(rideId);
  assertIsDriver(ride, userId);
  assertRideIsOpen(ride);

  // Disallow reducing totalSeats below the number already taken
  if (updates.totalSeats !== undefined) {
    const seatsTaken = ride.totalSeats - ride.availableSeats;
    if (updates.totalSeats < seatsTaken) {
      throw new ApiError(
        400,
        `Cannot reduce seats below ${seatsTaken} (already filled)`,
        ERROR.VALIDATION_ERROR
      );
    }
    // Recalculate availableSeats on seat count change
    updates.availableSeats = updates.totalSeats - seatsTaken;
  }

  // Guard: reject a past departureTime update
  if (updates.departureTime && new Date(updates.departureTime) <= new Date()) {
    throw new ApiError(400, 'Departure time must be in the future', ERROR.VALIDATION_ERROR);
  }

  return rideRepository.updateRideById(rideId, updates);
};

/**
 * FR-2.4 / FR-2.5: Cancel a ride. Only the driver can cancel.
 * Only cancellable when 'open' or 'full'.
 * @param {string} rideId
 * @param {string} userId
 */
const cancelRide = async (rideId, userId) => {
  const ride = await getRideOrThrow(rideId);
  assertIsDriver(ride, userId);

  if (ride.status === 'cancelled') {
    throw new ApiError(400, 'Ride is already cancelled', ERROR.RIDE_CLOSED);
  }
  if (ride.status === 'completed') {
    throw new ApiError(400, 'Cannot cancel a completed ride', ERROR.RIDE_CLOSED);
  }

  await rideRepository.setRideStatus(rideId, 'cancelled');
  return { message: 'Ride cancelled successfully.' };
};

/**
 * FR-2.5: Mark a ride as completed. Only the driver can do this.
 * Only completable when 'open' or 'full'.
 * @param {string} rideId
 * @param {string} userId
 */
const completeRide = async (rideId, userId) => {
  const ride = await getRideOrThrow(rideId);
  assertIsDriver(ride, userId);

  if (ride.status === 'cancelled') {
    throw new ApiError(400, 'Cannot complete a cancelled ride', ERROR.RIDE_CLOSED);
  }
  if (ride.status === 'completed') {
    throw new ApiError(400, 'Ride is already marked as completed', ERROR.RIDE_CLOSED);
  }

  await rideRepository.setRideStatus(rideId, 'completed');
  return { message: 'Ride marked as completed.' };
};

/**
 * Get all rides posted by the authenticated driver.
 * @param {string} driverId
 */
const getMyRides = async (driverId) => {
  return rideRepository.findRidesByDriver(driverId);
};

module.exports = {
  createRide,
  listRides,
  getRideById,
  updateRide,
  cancelRide,
  completeRide,
  getMyRides,
};
