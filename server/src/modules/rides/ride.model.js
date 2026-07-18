const { Schema, model } = require('mongoose');

/**
 * Ride Schema — SRS Section 6.3 (Entity: Rides)
 *
 * Status lifecycle:
 *   open → full       (availableSeats reaches 0 after request acceptance)
 *   open → cancelled  (driver cancels manually)
 *   open → completed  (driver marks trip done)
 *   full → open       (if an accepted request is withdrawn, seats free up)
 *   full → completed  (driver marks trip done)
 *
 * availableSeats — maintained at write time by the Requests module when it
 * accepts/rejects requests. Stored here to avoid aggregate queries on every
 * ride-list call (denormalisation; intentional for hackathon perf).
 */
const rideSchema = new Schema(
  {
    driver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Driver is required'],
      index: true,
    },
    origin: {
      type: String,
      required: [true, 'Origin is required'],
      trim: true,
      maxlength: [200, 'Origin cannot exceed 200 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
      maxlength: [200, 'Destination cannot exceed 200 characters'],
    },
    departureTime: {
      type: Date,
      required: [true, 'Departure time is required'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Must offer at least 1 seat'],
      max: [8, 'Cannot offer more than 8 seats'],
    },
    availableSeats: {
      type: Number,
      min: [0, 'Available seats cannot be negative'],
    },
    vehicleDescription: {
      type: String,
      trim: true,
      maxlength: [150, 'Vehicle description cannot exceed 150 characters'],
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'full', 'cancelled', 'completed', 'closed'],
      default: 'open',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Pre-save: initialise availableSeats = totalSeats on first save.
 * On subsequent saves the Requests module manages availableSeats explicitly,
 * so we only set it when it hasn't been assigned yet.
 */
rideSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

// Compound index for the most common list/search query
rideSchema.index({ status: 1, departureTime: 1 });
rideSchema.index({ driver: 1, status: 1 });

module.exports = model('Ride', rideSchema);
