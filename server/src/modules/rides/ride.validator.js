/**
 * ride.validator.js
 * -----------------
 * Joi schemas for every ride route.
 * Wired through the existing validate() middleware.
 */

const Joi = require('joi');

/**
 * POST /rides — create a ride
 */
const createRideSchema = Joi.object({
  origin: Joi.string().trim().min(3).max(200).required().messages({
    'string.min': 'Origin must be at least 3 characters',
    'string.max': 'Origin cannot exceed 200 characters',
    'any.required': 'Origin is required',
  }),
  destination: Joi.string().trim().min(3).max(200).required().messages({
    'string.min': 'Destination must be at least 3 characters',
    'string.max': 'Destination cannot exceed 200 characters',
    'any.required': 'Destination is required',
  }),
  departureTime: Joi.date().iso().greater('now').required().messages({
    'date.base': 'Departure time must be a valid date',
    'date.iso': 'Departure time must be in ISO 8601 format',
    'date.greater': 'Departure time must be in the future',
    'any.required': 'Departure time is required',
  }),
  totalSeats: Joi.number().integer().min(1).max(8).required().messages({
    'number.min': 'Must offer at least 1 seat',
    'number.max': 'Cannot offer more than 8 seats',
    'any.required': 'Total seats is required',
  }),
  vehicleDescription: Joi.string().trim().max(150).optional().allow(null, ''),
  notes: Joi.string().trim().max(500).optional().allow(null, ''),
});

/**
 * PATCH /rides/:id — update a ride (all fields optional, at least one required)
 */
const updateRideSchema = Joi.object({
  origin: Joi.string().trim().min(3).max(200).optional(),
  destination: Joi.string().trim().min(3).max(200).optional(),
  departureTime: Joi.date().iso().greater('now').optional().messages({
    'date.greater': 'Departure time must be in the future',
  }),
  totalSeats: Joi.number().integer().min(1).max(8).optional(),
  vehicleDescription: Joi.string().trim().max(150).optional().allow(null, ''),
  notes: Joi.string().trim().max(500).optional().allow(null, ''),
}).min(1); // at least one field required

/**
 * GET /rides — list/search rides query params
 */
const listRidesSchema = Joi.object({
  status: Joi.string().valid('open', 'full', 'completed', 'cancelled', 'closed').optional(),
  origin: Joi.string().trim().max(200).optional(),
  destination: Joi.string().trim().max(200).optional(),
  date: Joi.date().iso().optional(),
  minSeats: Joi.number().integer().min(1).max(8).optional(),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(50).default(20).optional(),
});

module.exports = {
  createRideSchema,
  updateRideSchema,
  listRidesSchema,
};
