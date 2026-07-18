const chatbotService = require('./chatbot.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * @desc   Send a message to the AI Assistant
 * @route  POST /api/v1/chatbot/message
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;
  
  // Use a generated ID or default to user id string so it groups chat context by default
  const activeConversationId = conversationId || `conv_${req.user.id}`;
  
  const result = await chatbotService.handleMessage(req.user.id, activeConversationId, message);

  res.status(200).json(new ApiResponse(200, {
    reply: result.reply,
    conversationId: activeConversationId
  }, 'Message processed successfully'));
});

module.exports = {
  sendMessage,
};
