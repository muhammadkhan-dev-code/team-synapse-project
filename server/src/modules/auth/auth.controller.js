/**
 * auth.controller.js
 * ------------------
 * Thin layer: parse req, call one service method, return ApiResponse.
 * Zero business logic, zero direct DB access.
 */

const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });
  res.status(201).json(new ApiResponse(201, result, result.message));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOtp({ email, otp });
  res.status(200).json(new ApiResponse(200, null, result.message));
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.resendOtp({ email });
  res.status(200).json(new ApiResponse(200, null, result.message));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  const result = await authService.refreshAccessToken({ refreshToken: token });
  res.status(200).json(new ApiResponse(200, result, 'Token refreshed'));
});

const logout = asyncHandler(async (req, res) => {
  // req.user is set by authenticate middleware
  const result = await authService.logout(req.user.sub);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.sub);
  res.status(200).json(new ApiResponse(200, user, 'Profile retrieved'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, profilePhoto } = req.body;
  const user = await authService.updateProfile(req.user.sub, { name, phone, profilePhoto });
  res.status(200).json(new ApiResponse(200, user, 'Profile updated'));
});

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
};
