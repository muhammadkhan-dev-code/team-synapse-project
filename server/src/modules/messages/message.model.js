const { Schema, model } = require('mongoose');

/**
 * Message Schema — SRS Module 4 / Entity: Messages
 *
 * Provides a REST-based message thread per ride.
 * Indexed by rideId and createdAt for chronological retrieval.
 */
const messageSchema = new Schema(
  {
    rideId: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: [true, 'Ride ID is required'],
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
      minlength: [1, 'Message cannot be empty'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

// Compound index for querying a ride's messages ordered by time
messageSchema.index({ rideId: 1, createdAt: 1 });

module.exports = model('Message', messageSchema);
