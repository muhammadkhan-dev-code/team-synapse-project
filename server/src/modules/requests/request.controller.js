/**
 * request.controller.js
 * ---------------------
 * Thin layer: parse req, call one service method, return ApiResponse.
 * Zero business logic, zero direct DB access.
 */

const requestService = require('./request.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * POST /api/v1/rides/:rideId/requests
 * FR-4.1 — Rider sends a join request.
 * Rider identity comes from JWT (req.user); rideId from route param.
 */
const sendRequest = asyncHandler(async (req, res) => {
  const request = await requestService.sendRequest(
    req.user.sub,     // riderId
    req.params.rideId,
    { name: req.user.name, email: req.user.email } // for FR-4.2 notification
  );
  res.status(201).json(new ApiResponse(201, request, 'Join request sent successfully'));
});

/**
 * GET /api/v1/rides/:rideId/requests
 * FR-4.3 (list) — Ride owner lists all requests for their ride.
 */
const listRequestsForRide = asyncHandler(async (req, res) => {
  const result = await requestService.listRequestsForRide(
    req.params.rideId,
    req.user.sub,
    req.query
  );
  res.status(200).json(new ApiResponse(200, result, 'Requests retrieved'));
});

/**
 * PATCH /api/v1/requests/:id
 * FR-4.3 — Ride owner accepts or declines a pending request.
 * Body: { action: 'accept' | 'reject' }
 */
const updateRequestStatus = asyncHandler(async (req, res) => {
  const updated = await requestService.updateRequestStatus(
    req.params.id,
    req.user.sub,
    req.body.action,
    { name: req.user.name, email: req.user.email }
  );
  const message =
    req.body.action === 'accept'
      ? 'Request accepted — rider has been added to the ride'
      : 'Request declined';
  res.status(200).json(new ApiResponse(200, updated, message));
});

/**
 * GET /api/v1/requests/mine
 * Rider views all of their own sent requests.
 */
const getMyRequests = asyncHandler(async (req, res) => {
  const result = await requestService.getMyRequests(req.user.sub, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Your requests retrieved'));
});

module.exports = {
  sendRequest,
  listRequestsForRide,
  updateRequestStatus,
  getMyRequests,
};
