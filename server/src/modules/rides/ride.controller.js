/**
 * ride.controller.js
 * ------------------
 * Thin layer: parse req, call one service method, return ApiResponse.
 * Zero business logic, zero direct DB access.
 */

const rideService = require('./ride.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * POST /api/v1/rides
 * Create a new ride — authenticated user becomes the driver.
 */
const createRide = asyncHandler(async (req, res) => {
  const ride = await rideService.createRide(req.user.sub, req.body);
  res.status(201).json(new ApiResponse(201, ride, 'Ride created successfully'));
});

/**
 * GET /api/v1/rides
 * List/search rides with optional query filters.
 */
const listRides = asyncHandler(async (req, res) => {
  const result = await rideService.listRides(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Rides retrieved'));
});

/**
 * GET /api/v1/rides/my
 * Get all rides posted by the authenticated driver.
 */
const getMyRides = asyncHandler(async (req, res) => {
  const rides = await rideService.getMyRides(req.user.sub);
  res.status(200).json(new ApiResponse(200, rides, 'Your rides retrieved'));
});

/**
 * GET /api/v1/rides/:id
 * Get a single ride by ID (driver details populated).
 */
const getRideById = asyncHandler(async (req, res) => {
  const ride = await rideService.getRideById(req.params.id);
  res.status(200).json(new ApiResponse(200, ride, 'Ride retrieved'));
});

/**
 * PATCH /api/v1/rides/:id
 * Update ride details — driver only, ride must be open.
 */
const updateRide = asyncHandler(async (req, res) => {
  const ride = await rideService.updateRide(req.params.id, req.user.sub, req.body);
  res.status(200).json(new ApiResponse(200, ride, 'Ride updated successfully'));
});

/**
 * PATCH /api/v1/rides/:id/cancel
 * Cancel a ride — driver only.
 */
const cancelRide = asyncHandler(async (req, res) => {
  const result = await rideService.cancelRide(req.params.id, req.user.sub);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

/**
 * PATCH /api/v1/rides/:id/complete
 * Mark ride as completed — driver only.
 */
const completeRide = asyncHandler(async (req, res) => {
  const result = await rideService.completeRide(req.params.id, req.user.sub);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

module.exports = {
  createRide,
  listRides,
  getMyRides,
  getRideById,
  updateRide,
  cancelRide,
  completeRide,
};
