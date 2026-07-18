const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ChatMessage model for persisting conversation history
 * (so context survives server restarts)
 */
const chatMessageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    conversationId: {
      type: String, // E.g., UUID or simple generated string by client/backend
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system', 'tool'],
      required: true,
    },
    content: {
      type: String,
      // For tool responses, content might temporarily be empty or stored as string block
    },
    toolCallId: {
      type: String,
    },
    name: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
