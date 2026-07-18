/**
 * auth.service.js
 * ---------------
 * ALL business logic lives here. No Mongoose imports, no HTTP-layer concerns.
 * Services call repositories, not models.
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const authRepository = require('./auth.repository');
const { sendOtpEmail } = require('../../utils/mailer');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const ApiError = require('../../utils/ApiError');
const ERROR = require('../../errors/errorCodes');
const { UNIVERSITY_EMAIL_DOMAIN } = require('../../config/env');

/** OTP config — flag these if values need changing */
const OTP_LENGTH = 6;
const OTP_EXPIRY_HOURS = 24;
const OTP_SALT_ROUNDS = 10; // lighter than password hashing — OTP is short-lived

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random numeric OTP.
 * @returns {string} zero-padded 6-digit string
 */
const generateOtp = () => {
  const max = Math.pow(10, OTP_LENGTH);
  const otp = crypto.randomInt(0, max);
  return String(otp).padStart(OTP_LENGTH, '0');
};

/**
 * Validate that an email ends with the allowed university domain.
 * UNIVERSITY_EMAIL_DOMAIN env var should start with '@', e.g. '@szabist.edu.pk'.
 * If the env var is not set, skip the domain check (development convenience).
 *
 * ⚠️  FLAGGED DEFAULT: If UNIVERSITY_EMAIL_DOMAIN is not set in .env the domain
 * check is disabled. Set it before deploying to production/demo.
 */
const assertUniversityEmail = (email) => {
  if (!UNIVERSITY_EMAIL_DOMAIN) return; // skip check if not configured
  if (!email.toLowerCase().endsWith(UNIVERSITY_EMAIL_DOMAIN.toLowerCase())) {
    throw new ApiError(
      400,
      `Only university emails ending in ${UNIVERSITY_EMAIL_DOMAIN} are allowed`,
      ERROR.VALIDATION_ERROR
    );
  }
};

/**
 * Build the JWT payload from a user document.
 * Keep this minimal — never include sensitive fields.
 */
const buildTokenPayload = (user) => ({
  sub: user._id.toString(),
  role: user.role,
});

// ─── Service methods ──────────────────────────────────────────────────────────

/**
 * FR-1.1, FR-1.3, FR-1.5: Register a new student account.
 * Validates university email domain, checks for duplicates, then:
 *   1. Creates user (password hashed by pre-save hook)
 *   2. Generates + stores OTP
 *   3. Sends OTP email
 */
const register = async ({ name, email, password }) => {
  // FR-1.3: reject non-university emails
  assertUniversityEmail(email);

  // Duplicate check
  const existing = await authRepository.findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists', ERROR.DUPLICATE_RESOURCE);
  }

  // Create user (password hashing via pre-save hook in model)
  const user = await authRepository.createUser({ name, email, password });

  // Generate OTP, hash it, store it
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, OTP_SALT_ROUNDS);
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_HOURS * 60 * 60 * 1000);
  await authRepository.setOtp(user._id, otpHash, otpExpiry);

  // Send OTP email (non-blocking failure should not break registration response)
  try {
    await sendOtpEmail(email, otp);
  } catch (mailErr) {
    // Log but don't expose mailer errors to client
    console.error('[Auth] Failed to send OTP email:', mailErr.message);
  }

  return {
    message: `Verification OTP sent to ${email}. Please check your inbox.`,
    userId: user._id,
  };
};

/**
 * FR-1.2: Verify OTP and activate account.
 */
const verifyOtp = async ({ email, otp }) => {
  // Load user with otp fields (normally hidden)
  const user = await authRepository.findUserByEmail(email, '+otp +otpExpiry');
  if (!user) {
    throw new ApiError(404, 'No account found with this email', ERROR.NOT_FOUND);
  }

  if (user.isVerified) {
    throw new ApiError(400, 'Account is already verified', ERROR.ACCOUNT_ALREADY_VERIFIED);
  }

  if (!user.otp || !user.otpExpiry) {
    throw new ApiError(400, 'No pending OTP found. Please request a new one.', ERROR.INVALID_OTP);
  }

  if (new Date() > user.otpExpiry) {
    throw new ApiError(400, 'OTP has expired. Please request a new one.', ERROR.OTP_EXPIRED);
  }

  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) {
    throw new ApiError(400, 'Invalid OTP', ERROR.INVALID_OTP);
  }

  await authRepository.clearOtpAndVerify(user._id);

  return { message: 'Email verified successfully. You can now log in.' };
};

/**
 * Resend OTP to an unverified account.
 */
const resendOtp = async ({ email }) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new ApiError(404, 'No account found with this email', ERROR.NOT_FOUND);
  }
  if (user.isVerified) {
    throw new ApiError(400, 'Account is already verified', ERROR.ACCOUNT_ALREADY_VERIFIED);
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, OTP_SALT_ROUNDS);
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_HOURS * 60 * 60 * 1000);
  await authRepository.setOtp(user._id, otpHash, otpExpiry);

  try {
    await sendOtpEmail(email, otp);
  } catch (mailErr) {
    console.error('[Auth] Failed to resend OTP email:', mailErr.message);
  }

  return { message: `A new OTP has been sent to ${email}.` };
};

/**
 * FR-1.6: Login — validate credentials, enforce email verification, issue JWTs.
 */
const login = async ({ email, password }) => {
  // Load user with password field (normally hidden)
  const user = await authRepository.findUserByEmail(email, '+password +refreshToken');
  if (!user) {
    // Use vague message to prevent user enumeration
    throw new ApiError(401, 'Invalid email or password', ERROR.INVALID_CREDENTIALS);
  }

  if (!user.isVerified) {
    throw new ApiError(403, 'Please verify your email before logging in', ERROR.EMAIL_NOT_VERIFIED);
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new ApiError(401, 'Invalid email or password', ERROR.INVALID_CREDENTIALS);
  }

  const payload = buildTokenPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Persist refresh token
  await authRepository.setRefreshToken(user._id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      averageRating: user.averageRating,
    },
  };
};

/**
 * Issue a new access token using a valid refresh token.
 */
const refreshAccessToken = async ({ refreshToken }) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token', ERROR.TOKEN_INVALID);
  }

  // Load user and verify the stored refresh token matches
  const user = await authRepository.findUserById(decoded.sub, '+refreshToken');
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Refresh token mismatch or user not found', ERROR.TOKEN_INVALID);
  }

  const payload = buildTokenPayload(user);
  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload); // rotate refresh token

  await authRepository.setRefreshToken(user._id, newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * Logout — invalidate the refresh token server-side.
 */
const logout = async (userId) => {
  await authRepository.setRefreshToken(userId, null);
  return { message: 'Logged out successfully.' };
};

/**
 * FR-1.4: Get own profile.
 */
const getProfile = async (userId) => {
  const user = await authRepository.getPublicProfile(userId);
  if (!user) {
    throw new ApiError(404, 'User not found', ERROR.NOT_FOUND);
  }
  return user;
};

/**
 * FR-1.4: Update own profile (name, phone, profilePhoto).
 * Email and password changes require separate dedicated endpoints (not in FR for hackathon scope).
 */
const updateProfile = async (userId, { name, phone, profilePhoto }) => {
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (phone !== undefined) updateFields.phone = phone;
  if (profilePhoto !== undefined) updateFields.profilePhoto = profilePhoto;

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, 'No update fields provided', ERROR.VALIDATION_ERROR);
  }

  const updated = await authRepository.updateUserById(userId, updateFields);
  if (!updated) {
    throw new ApiError(404, 'User not found', ERROR.NOT_FOUND);
  }

  return updated;
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
};
