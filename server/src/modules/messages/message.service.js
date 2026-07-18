/**
 * message.service.js
 * ------------------
 * Business logic for messages. Enforces participant-only access rules.
 */

const messageRepository = require('./message.repository');
const { findRideById } = require('../rides/ride.repository');
const { findExistingRequest } = require('../requests/request.repository');
const ApiError = require('../../utils/ApiError');
const errorCodes = require('../../errors/errorCodes');
const { checkParticipant } = require('../../utils/participant.util');


/**
 * Send a message in a ride's thread.
 * Only participants can send messages.
 * @param {string} rideId
 * @param {string} senderId
 * @param {string} text
 * @returns {Promise<Object>}
 */
const sendMessage = async (rideId, senderId, text) => {
  const isParticipant = await checkParticipant(rideId, senderId);
  if (!isParticipant) {
    throw new ApiError(
      404,
      'Thread not found',
      errorCodes.THREAD_NOT_FOUND || 'THREAD_NOT_FOUND'
    );
  }

  return messageRepository.createMessage({ rideId, senderId, text });
};

/**
 * Get messages for a ride's thread.
 * Only participants can view messages.
 * @param {string} rideId
 * @param {string} userId
 * @param {Object} queryOptions - { page, limit }
 * @returns {Promise<Object>}
 */
const getThread = async (rideId, userId, { page = 1, limit = 50 }) => {
  const isParticipant = await checkParticipant(rideId, userId);
  if (!isParticipant) {
    throw new ApiError(
      404,
      'Thread not found',
      errorCodes.THREAD_NOT_FOUND || 'THREAD_NOT_FOUND'
    );
  }

  return messageRepository.getMessagesByRide(rideId, { page: parseInt(page, 10), limit: parseInt(limit, 10) });
};

module.exports = {
  sendMessage,
  getThread,
};
