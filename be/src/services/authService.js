import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { config } from "../config/env.js";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} from "../utils/errorHandler.js";
import { sendOTPEmail } from "./emailService.js";

// Store OTP in memory (nên dùng Redis trong production)
const otpStore = new Map();

/**
 * Đăng ký user mới
 */
export const register = async (userData) => {
  const { username, email, password, fullName, phone, address } = userData;

  // Kiểm tra email đã tồn tại
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError("Email đã được sử dụng");
  }

  // Kiểm tra username đã tồn tại
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ValidationError("Username đã được sử dụng");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    fullName,
    phone,
    address,
    role: "user",
    isActive: true,
  });

  // Tạo token
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

/**
 * Đăng nhập
 */
export const login = async (email, password) => {
  console.log("Login attempt:", { email, password: "***" });

  // Tìm user bằng email hoặc username
  const user = await User.findOne({
    $or: [
      { email: email },
      { username: email }, // email parameter có thể chứa username
    ],
  });

  console.log(
    "User found:",
    user ? { username: user.username, email: user.email } : "null",
  );

  if (!user) {
    throw new UnauthorizedError("Email/Username hoặc mật khẩu không đúng");
  }

  // Kiểm tra account active
  if (!user.isActive) {
    throw new UnauthorizedError("Tài khoản đã bị vô hiệu hóa");
  }

  // Kiểm tra password
  console.log("Comparing password...");
  console.log("Input password:", password);
  console.log("Stored hash:", user.password);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Password valid:", isPasswordValid);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Email/Username hoặc mật khẩu không đúng");
  }

  // Cập nhật lastLogin
  user.lastLogin = new Date();
  await user.save();

  // Tạo token
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    },
    token,
  };
};

/**
 * Lấy profile user
 */
export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError("User không tồn tại");
  }
  return user;
};

/**
 * Cập nhật profile
 */
export const updateProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    throw new NotFoundError("User không tồn tại");
  }

  return user;
};

/**
 * Quên mật khẩu - Gửi OTP
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("Email không tồn tại trong hệ thống");
  }

  // Tạo OTP 6 số
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút

  // Lưu OTP
  otpStore.set(email, { otp, expiresAt });

  // Gửi email
  await sendOTPEmail(email, otp);

  return { message: "OTP đã được gửi đến email của bạn" };
};

/**
 * Reset mật khẩu với OTP
 */
export const resetPassword = async (email, otp, newPassword) => {
  // Kiểm tra OTP
  const otpData = otpStore.get(email);
  if (!otpData) {
    throw new ValidationError("OTP không hợp lệ hoặc đã hết hạn");
  }

  if (otpData.otp !== otp) {
    throw new ValidationError("OTP không đúng");
  }

  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(email);
    throw new ValidationError("OTP đã hết hạn");
  }

  // Tìm user và cập nhật password
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User không tồn tại");
  }

  // Hash password mới
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  // Xóa OTP
  otpStore.delete(email);

  return { message: "Đặt lại mật khẩu thành công" };
};

/**
 * Tạo JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiry },
  );
};
