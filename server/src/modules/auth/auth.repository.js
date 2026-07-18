/**
 * auth.repository.js
 * ------------------
 * THE ONLY file that imports the User model directly.
 * All other layers go through this file — no exceptions.
 * Uses .lean() for read-only queries where a plain JS object is sufficient.
 */

const User = require('./user.model');

/**
 * Create a new user document.
 * @param {Object} data
 * @returns {Promise<User>}
 */
const createUser = async (data) => {
  const user = new User(data);
  return user.save();
};

/**
 * Find a user by email.
 * By default does NOT select password/otp fields.
 * @param {string} email
 * @param {Object} [projection] - e.g. '+password +otp +otpExpiry'
 * @returns {Promise<User|null>}
 */
const findUserByEmail = async (email, projection = '') => {
  return User.findOne({ email: email.toLowerCase() }).select(projection);
};

/**
 * Find a user by their Mongo _id.
 * @param {string} id
 * @param {string} [projection]
 * @returns {Promise<User|null>}
 */
const findUserById = async (id, projection = '') => {
  return User.findById(id).select(projection);
};

/**
 * Update specific fields on a user by id.
 * Returns the updated document excluding sensitive fields.
 * @param {string} id
 * @param {Object} updateFields
 * @returns {Promise<User|null>}
 */
const updateUserById = async (id, updateFields) => {
  return User.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });
};

/**
 * Atomically update the user's OTP and expiry.
 * @param {string} id
 * @param {string} otpHash - bcrypt hash of the OTP
 * @param {Date}   expiry  - expiry Date object
 */
const setOtp = async (id, otpHash, expiry) => {
  return User.findByIdAndUpdate(id, {
    otp: otpHash,
    otpExpiry: expiry,
  });
};

/**
 * Clear OTP fields after successful verification.
 * @param {string} id
 */
const clearOtpAndVerify = async (id) => {
  return User.findByIdAndUpdate(id, {
    isVerified: true,
    otp: undefined,
    otpExpiry: undefined,
  });
};

/**
 * Store (or clear) the user's refresh token.
 * @param {string} id
 * @param {string|null} token
 */
const setRefreshToken = async (id, token) => {
  return User.findByIdAndUpdate(id, { refreshToken: token });
};

/**
 * Return a lean user object for public profile display.
 * Explicitly excludes all sensitive fields.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getPublicProfile = async (id) => {
  return User.findById(id)
    .select('-password -otp -otpExpiry -refreshToken')
    .lean();
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  setOtp,
  clearOtpAndVerify,
  setRefreshToken,
  getPublicProfile,
};
