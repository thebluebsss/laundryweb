import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/response.js";
import * as authService from "../services/authService.js";

/**
 * @desc    Đăng ký user mới
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  successResponse(res, result, "Đăng ký thành công", 201);
});

/**
 * @desc    Đăng nhập
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const emailOrUsername = email || username; // Accept either email or username
  const result = await authService.login(emailOrUsername, password);
  successResponse(res, result, "Đăng nhập thành công");
});

/**
 * @desc    Lấy profile user hiện tại
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  successResponse(res, user, "Lấy profile thành công");
});

/**
 * @desc    Cập nhật profile
 * @route   PATCH /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  successResponse(res, user, "Cập nhật profile thành công");
});

/**
 * @desc    Quên mật khẩu - Gửi OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  successResponse(res, result, "OTP đã được gửi");
});

/**
 * @desc    Reset mật khẩu với OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await authService.resetPassword(email, otp, newPassword);
  successResponse(res, result, "Đặt lại mật khẩu thành công");
});
