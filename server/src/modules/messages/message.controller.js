/**
 * message.controller.js
 * ---------------------
 * Controller layer for messages. Thin wrapper evaluating req/res.
 */

const messageService = require('./message.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * Send a new message
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const { text } = req.body;
  const userId = req.user.sub; // standardized with req.user.sub

  // FUTURE ENHANCEMENT: Migrate polling to Socket.IO for true real-time delivery.
  const message = await messageService.sendMessage(rideId, userId, text);

  return res
    .status(201)
    .json(new ApiResponse(true, 201, 'Message sent successfully', message));
});

/**
 * Get message thread for a ride
 * FUTURE ENHANCEMENT: Read receipts / typing indicators
 */
const getThread = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user.sub;
  const { page, limit } = req.query;

  const result = await messageService.getThread(rideId, userId, { page, limit });

  return res
    .status(200)
    .json(new ApiResponse(true, 200, 'Thread retrieved successfully', result));
});

module.exports = {
  sendMessage,
  getThread,
};
