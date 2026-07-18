const { Schema, model } = require('mongoose');

const ratingSchema = new Schema(
  {
    rideId: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: [true, 'Ride ID is required'],
      index: true,
    },
    raterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Rater ID is required'],
    },
    rateeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ratee ID is required'],
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [1, 'Score must be at least 1'],
      max: [5, 'Score cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

// Compound UNIQUE index to prevent duplicate ratings for the same ride by the same rater
ratingSchema.index({ rideId: 1, raterId: 1, rateeId: 1 }, { unique: true });

module.exports = model('Rating', ratingSchema);
