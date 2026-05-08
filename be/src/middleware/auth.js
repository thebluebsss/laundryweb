import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { UnauthorizedError, ForbiddenError } from "../utils/errorHandler.js";
import User from "../models/User.js";

/**
 * Middleware xác thực JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Token không được cung cấp");
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    // Lấy thông tin user từ database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new UnauthorizedError("User không tồn tại");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Tài khoản đã bị vô hiệu hóa");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("Token không hợp lệ"));
    } else if (error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Token đã hết hạn"));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware kiểm tra quyền admin
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Vui lòng đăng nhập"));
  }

  if (req.user.role !== "admin") {
    return next(new ForbiddenError("Chỉ admin mới có quyền truy cập"));
  }

  next();
};

/**
 * Middleware kiểm tra quyền sở hữu resource
 */
export const requireOwnership = (resourceUserIdField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Vui lòng đăng nhập"));
    }

    // Admin có thể truy cập mọi resource
    if (req.user.role === "admin") {
      return next();
    }

    // Kiểm tra ownership
    const resourceUserId =
      req[resourceUserIdField] || req.body[resourceUserIdField];

    if (
      resourceUserId &&
      resourceUserId.toString() !== req.user._id.toString()
    ) {
      return next(
        new ForbiddenError("Bạn không có quyền truy cập resource này"),
      );
    }

    next();
  };
};
