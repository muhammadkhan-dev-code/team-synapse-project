/**
 * message.repository.js
 * ---------------------
 * THE ONLY file that imports the Message model directly.
 * All other layers access the DB through this file.
 */

const Message = require('./message.model');

/**
 * Create a new message in the database.
 * @param {Object} data - { rideId, senderId, content }
 * @returns {Promise<Message>}
 */
const createMessage = async (data) => {
  const message = new Message(data);
  return message.save();
};

/**
 * List all messages for a specific ride with pagination.
 * Messages are returned in chronological order (oldest first).
 * @param {string} rideId
 * @param {Object} pagination - { page, limit }
 * @returns {Promise<{messages, total, page, totalPages}>}
 */
const getMessagesByRide = async (rideId, { page = 1, limit = 50 } = {}) => {
  const query = { rideId };
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find(query)
      .populate('senderId', 'name email profilePhoto')
      .sort({ createdAt: 1 }) // Chronological order
      .skip(skip)
      .limit(limit)
      .lean(),
    Message.countDocuments(query),
  ]);

  return { messages: messages, total, page, totalPages: Math.ceil(total / limit) };
};

module.exports = {
  createMessage,
  getMessagesByRide,
};
