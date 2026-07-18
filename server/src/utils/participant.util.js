const { findRideById, findRidesByDriver } = require('../modules/rides/ride.repository');
const { findExistingRequest } = require('../modules/requests/request.repository');
/**
 * Verifies if a user is allowed to access resources for a ride (messages, ratings).
 * @param {string} rideId
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
const checkParticipant = async (rideId, userId) => {
  const ride = await findRideById(rideId);
  if (!ride) {
    return false;
  }

  // 1. Is driver?
  if (ride.driver.toString() === userId.toString()) {
    return true;
  }

  // 2. Is accepted rider?
  const request = await findExistingRequest(userId, rideId);
  if (request && request.status === 'accepted') {
    return true;
  }

  return false;
};

module.exports = {
  checkParticipant,
};
