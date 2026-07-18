const ChatMessage = require('./chatbot.model');

/**
 * Persists a new chat message to the DB
 */
const saveMessage = async (data) => {
  const msg = new ChatMessage(data);
  return msg.save();
};

/**
 * Retrieve the last N messages for a conversation
 * Ranked by createdAt ASC so it forms a logical chat log
 */
const getConversationHistory = async (conversationId, limit = 15) => {
  const messages = await ChatMessage.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return messages.reverse();
};

module.exports = {
  saveMessage,
  getConversationHistory,
};
