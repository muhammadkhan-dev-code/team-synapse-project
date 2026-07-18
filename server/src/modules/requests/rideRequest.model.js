const { Schema, model } = require('mongoose');

/**
 * RideRequest Schema — SRS Section 6.3 (Entity: RideRequests)
 *
 * Fields:
 *   riderId       — ref to Users; the student sending the join request
 *   rideId        — ref to Rides; the ride being requested
 *   status        — pending | accepted | rejected
 *   requestedAt   — timestamp when the request was first created
 *   statusHistory — array of { status, changedAt } for full audit trail
 *                   (NFR-Auditability: every status transition is recorded)
 *
 * Indexes:
 *   Unique compound index on (riderId, rideId) — enforces FR-4.6 duplicate
 *   prevention at the database layer, closing race conditions that a pure
 *   application-level check cannot handle under concurrent requests.
 */
const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const rideRequestSchema = new Schema(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Rider is required'],
      index: true,
    },
    rideId: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: [true, 'Ride is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    /**
     * Audit trail — every status change appends a new entry here.
     * Initial 'pending' entry is pushed on document creation.
     */
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,  // adds createdAt / updatedAt
    versionKey: false,
  }
);

/**
 * FR-4.6 — Unique compound index at the DB layer.
 * Prevents duplicate join requests from the same rider for the same ride
 * even under concurrent HTTP requests (application-level checks alone cannot
 * guarantee this without a database uniqueness constraint).
 */
rideRequestSchema.index({ riderId: 1, rideId: 1 }, { unique: true });

module.exports = model('RideRequest', rideRequestSchema);
