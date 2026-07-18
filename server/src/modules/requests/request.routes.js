/**
 * request.routes.js
 * -----------------
 * Route declarations only: HTTP method + path + middleware chain + controller.
 * No logic whatsoever lives here.
 *
 * This router is mounted at /api/v1 in app.js and handles two path prefixes:
 *   /rides/:rideId/requests  — nested under a specific ride
 *   /requests                — flat resource for cross-ride operations
 *
 * IMPORTANT: /mine must be declared BEFORE /:id to prevent Express from
 * treating the literal string "mine" as a MongoDB ObjectId (same pattern
 * established in ride.routes.js for /my vs /:id).
 */

const express = require('express');
const router = express.Router();

const requestController = require('./request.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');

const {
  sendRequestSchema,
  listRequestsSchema,
  myRequestsSchema,
  updateRequestSchema,
} = require('./request.validator');

// All request routes require a valid access token
router.use(authenticate);

// ─── Nested under rides ───────────────────────────────────────────────────────

/**
 * POST /api/v1/rides/:rideId/requests
 * FR-4.1 — Rider sends a join request to the ride owner.
 */
router.post(
  '/rides/:rideId/requests',
  validate(sendRequestSchema),
  requestController.sendRequest
);

/**
 * GET /api/v1/rides/:rideId/requests
 * FR-4.3 — Owner lists all requests for their ride.
 * Service enforces ownership; no separate authorize middleware needed since
 * the check uses ride ownership, not a role enum.
 */
router.get(
  '/rides/:rideId/requests',
  validate(listRequestsSchema, 'query'),
  requestController.listRequestsForRide
);

// ─── Flat request resource ────────────────────────────────────────────────────

/**
 * GET /api/v1/requests/mine
 * Rider views all of their own sent requests.
 * MUST be declared before /:id — see note above.
 */
router.get(
  '/requests/mine',
  validate(myRequestsSchema, 'query'),
  requestController.getMyRequests
);

/**
 * PATCH /api/v1/requests/:id
 * FR-4.3 — Owner accepts or declines a pending request.
 * Body: { action: 'accept' | 'reject' }
 */
router.patch(
  '/requests/:id',
  validate(updateRequestSchema),
  requestController.updateRequestStatus
);

module.exports = router;
