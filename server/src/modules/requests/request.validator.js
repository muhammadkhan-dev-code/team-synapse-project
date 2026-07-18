const Joi = require('joi');

/**
 * request.validator.js
 * --------------------
 * Joi schemas for the Ride Requests module.
 * All schemas are exported and consumed by the validate middleware.
 */

/**
 * POST /api/v1/rides/:rideId/requests
 * Body: (empty — rideId comes from params, riderId from JWT)
 * We still define a schema so the validate middleware can strip unknowns.
 */
const sendRequestSchema = Joi.object({
  // No body fields required; rideId is a route param, riderId from JWT
}).options({ allowUnknown: false });

/**
 * GET /api/v1/rides/:rideId/requests
 * Query params for pagination + optional status filter
 */
const listRequestsSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

/**
 * GET /api/v1/requests/mine
 * Query params for pagination + optional status filter
 */
const myRequestsSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

/**
 * PATCH /api/v1/requests/:id
 * Body: { action: 'accept' | 'reject' }
 */
const updateRequestSchema = Joi.object({
  action: Joi.string().valid('accept', 'reject').required().messages({
    'any.only': 'action must be "accept" or "reject"',
    'any.required': 'action is required',
  }),
});

module.exports = {
  sendRequestSchema,
  listRequestsSchema,
  myRequestsSchema,
  updateRequestSchema,
};
