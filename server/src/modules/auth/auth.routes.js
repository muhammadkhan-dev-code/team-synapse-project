/**
 * auth.routes.js
 * --------------
 * Route declarations only: HTTP method + path + middleware chain + controller.
 * No logic whatsoever lives here.
 *
 * Mounted at: /api/v1/auth
 */

const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const { authLimiter } = require('../../middlewares/rateLimiter');

const {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
} = require('./auth.validator');

// ─── Public routes (no authentication required) ───────────────────────────────

/**
 * POST /api/v1/auth/register
 * FR-1.1, FR-1.3, FR-1.5 — Register with university email
 */
router.post('/register', authLimiter, validate(registerSchema), authController.register);

/**
 * POST /api/v1/auth/verify-otp
 * FR-1.2 — Verify email with OTP
 */
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyOtp);

/**
 * POST /api/v1/auth/resend-otp
 * FR-1.2 — Resend verification OTP
 */
router.post('/resend-otp', authLimiter, validate(resendOtpSchema), authController.resendOtp);

/**
 * POST /api/v1/auth/login
 * FR-1.6 — Login and receive JWT tokens
 */
router.post('/login', authLimiter, validate(loginSchema), authController.login);

/**
 * POST /api/v1/auth/refresh-token
 * Issue new access token using refresh token
 */
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// ─── Protected routes (must carry a valid access token) ───────────────────────

/**
 * POST /api/v1/auth/logout
 * Invalidate the refresh token server-side
 */
router.post('/logout', authenticate, authController.logout);

/**
 * GET /api/v1/auth/me
 * FR-1.4 — Get own profile
 */
router.get('/me', authenticate, authController.getProfile);

/**
 * PATCH /api/v1/auth/me
 * FR-1.4 — Update own profile (name, phone, profilePhoto)
 */
router.patch('/me', authenticate, validate(updateProfileSchema), authController.updateProfile);

module.exports = router;
