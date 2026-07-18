/**
 * ride.routes.js
 * --------------
 * Route declarations only: HTTP method + path + middleware chain + controller.
 * No logic whatsoever lives here.
 *
 * Mounted at: /api/v1/rides
 *
 * IMPORTANT: /my must be declared BEFORE /:id, otherwise Express will try
 * to parse the literal string "my" as a MongoDB ObjectId and fail with a
 * CastError before the controller is ever reached.
 */

const express = require('express');
const router = express.Router();

const rideController = require('./ride.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');

const {
  createRideSchema,
  updateRideSchema,
  listRidesSchema,
} = require('./ride.validator');

// All ride routes require a valid access token
router.use(authenticate);

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * POST /api/v1/rides
 * FR-2.1 — Create a ride
 */
router.post('/', validate(createRideSchema), rideController.createRide);

/**
 * GET /api/v1/rides
 * FR-2.2 — List/search available rides
 */
router.get('/', validate(listRidesSchema, 'query'), rideController.listRides);

// ─── Sub-resource: my rides (must come BEFORE /:id) ──────────────────────────

/**
 * GET /api/v1/rides/my
 * Get all rides posted by the authenticated user
 */
router.get('/my', rideController.getMyRides);

// ─── Single-resource routes ───────────────────────────────────────────────────

/**
 * GET /api/v1/rides/:id
 * FR-2.3 — Get a single ride by ID
 */
router.get('/:id', rideController.getRideById);

/**
 * PATCH /api/v1/rides/:id
 * FR-2.4 — Update ride details (driver only; ride must be open)
 */
router.patch('/:id', validate(updateRideSchema), rideController.updateRide);

/**
 * PATCH /api/v1/rides/:id/cancel
 * FR-2.5 — Cancel a ride (driver only)
 */
router.patch('/:id/cancel', rideController.cancelRide);

/**
 * PATCH /api/v1/rides/:id/complete
 * FR-2.5 — Mark ride as completed (driver only)
 */
router.patch('/:id/complete', rideController.completeRide);

module.exports = router;
