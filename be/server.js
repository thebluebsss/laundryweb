import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Groq from "groq-sdk";
import Booking from "./Booking.js";
import Product from "./Product.js";
import User from "./User.js";
import Equipment from "./Equipment.js";
import { sendOTPEmail, sendPasswordResetConfirmation } from "./emailService.js";
import { sendOTPSMS, sendPasswordResetSMS } from "./smsService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy token xác thực",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền thực hiện thao tác này",
    });
  }
  next();
};

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/laundry-booking"
    );
    console.log("✅ MongoDB đã kết nối thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
  }
};

connectDB();

let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

// ===================== HEALTH CHECK =====================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    timestamp: new Date(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// ===================== AUTH APIs =====================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password, fullName, phone, address } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc tên đăng nhập đã tồn tại",
      });
    }

    const user = new User({
      username,
      email,
      password,
      fullName,
      phone,
      address: address || "",
      role: "user",
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký",
      error: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập",
      error: error.message,
    });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email, phone, method } = req.body;

    // Kiểm tra phương thức
    if (!method || (method !== "email" && method !== "phone")) {
      return res.status(400).json({
        success: false,
        message: "Phương thức không hợp lệ",
      });
    }

    // Kiểm tra thông tin theo phương thức
    if (method === "email" && !email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email",
      });
    }

    if (method === "phone" && !phone) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập số điện thoại",
      });
    }

    // Tìm user theo phương thức được chọn
    let user;
    if (method === "email") {
      user = await User.findOne({ email: email });
    } else {
      user = await User.findOne({ phone: phone });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy tài khoản với ${
          method === "email" ? "email" : "số điện thoại"
        } này`,
      });
    }

    // Tạo mã OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP vào user (expire sau 10 phút)
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Gửi OTP thật qua email hoặc SMS
    let sendResult;
    if (method === "email") {
      sendResult = await sendOTPEmail(email, otp, user.fullName);

      if (!sendResult.success) {
        return res.status(500).json({
          success: false,
          message: "Không thể gửi email. Vui lòng thử lại sau.",
        });
      }

      console.log(`📧 OTP đã gửi qua EMAIL ${email}: ${otp}`);
    } else {
      sendResult = await sendOTPSMS(phone, otp);

      if (!sendResult.success) {
        return res.status(500).json({
          success: false,
          message: "Không thể gửi SMS. Vui lòng thử lại sau.",
        });
      }

      console.log(`📱 OTP đã gửi qua SMS ${phone}: ${otp}`);
    }

    res.json({
      success: true,
      message: `Mã OTP đã được gửi đến ${
        method === "email" ? "email" : "số điện thoại"
      } của bạn`,
      // BỎ dòng này trong production để bảo mật
      // otp: otp,
    });
  } catch (error) {
    console.error("❌ Lỗi forgot password:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, phone, otp, newPassword, method } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    // Tìm user theo phương thức và OTP hợp lệ
    let user;
    if (method === "email") {
      user = await User.findOne({
        email: email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() },
      });
    } else {
      user = await User.findOne({
        phone: phone,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Gửi email/SMS xác nhận
    if (method === "email") {
      await sendPasswordResetConfirmation(user.email, user.fullName);
    } else {
      await sendPasswordResetSMS(user.phone);
    }

    res.json({
      success: true,
      message:
        "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.",
    });
  } catch (error) {
    console.error("❌ Lỗi reset password:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// ===================== USER PROFILE APIs =====================

app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin người dùng",
      error: error.message,
    });
  }
});

app.patch("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const { password, role, isActive, ...updateData } = req.body;
    if (password) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công!",
      data: user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật thông tin",
      error: error.message,
    });
  }
});

// ===================== USER MANAGEMENT APIs (Admin Only) =====================

app.get("/api/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách người dùng",
      error: error.message,
    });
  }
});

app.get("/api/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin người dùng",
      error: error.message,
    });
  }
});

app.post("/api/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, fullName, phone, role, address } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc tên đăng nhập đã tồn tại",
      });
    }

    const user = new User({
      username,
      email,
      password,
      fullName,
      phone,
      role: role || "user",
      address: address || "",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Tạo người dùng thành công!",
      data: user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo người dùng",
      error: error.message,
    });
  }
});

app.patch(
  "/api/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { password, ...updateData } = req.body;

      if (password) {
        const bcrypt = await import("bcryptjs");
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật người dùng thành công!",
        data: user.toJSON(),
      });
    } catch (error) {
      console.error("❌ Lỗi:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật người dùng",
        error: error.message,
      });
    }
  }
);

app.delete(
  "/api/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      if (req.params.id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Không thể xóa tài khoản của chính mình",
        });
      }

      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      res.json({
        success: true,
        message: "Đã xóa người dùng thành công!",
      });
    } catch (error) {
      console.error("❌ Lỗi:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi xóa người dùng",
        error: error.message,
      });
    }
  }
);

app.patch(
  "/api/users/:id/toggle-active",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      user.isActive = !user.isActive;
      await user.save();

      res.json({
        success: true,
        message: `Đã ${user.isActive ? "kích hoạt" : "vô hiệu hóa"} tài khoản!`,
        data: user.toJSON(),
      });
    } catch (error) {
      console.error("❌ Lỗi:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật trạng thái",
        error: error.message,
      });
    }
  }
);

app.get(
  "/api/users-stats",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const total = await User.countDocuments();
      const active = await User.countDocuments({ isActive: true });
      const inactive = await User.countDocuments({ isActive: false });
      const admins = await User.countDocuments({ role: "admin" });
      const users = await User.countDocuments({ role: "user" });

      res.json({
        success: true,
        stats: {
          total,
          active,
          inactive,
          admins,
          users,
        },
      });
    } catch (error) {
      console.error("❌ Lỗi:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thống kê",
        error: error.message,
      });
    }
  }
);

// ===================== BOOKING APIs =====================

app.get("/api/bookings", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy bookings:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tải đơn hàng",
      error: error.message,
    });
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Lỗi lấy booking:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tải đơn hàng",
      error: error.message,
    });
  }
});

app.get("/api/bookings/phone/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const bookings = await Booking.find({ phone: new RegExp(phone, "i") }).sort(
      {
        createdAt: -1,
      }
    );

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Lỗi tìm kiếm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm",
      error: error.message,
    });
  }
});

app.patch("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Thiếu trạng thái",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: booking,
      message: "Đã cập nhật trạng thái",
    });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái",
      error: error.message,
    });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa đơn hàng thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa đơn hàng",
      error: error.message,
    });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      status: "pending",
      createdAt: new Date(),
    });

    await booking.save();

    res.status(201).json({
      success: true,
      data: booking,
      message: "Đặt lịch thành công",
    });
  } catch (error) {
    console.error("Lỗi tạo booking:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng",
      error: error.message,
    });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: "pending" });
    const confirmed = await Booking.countDocuments({
      status: { $in: ["confirmed", "processing"] },
    });
    const completed = await Booking.countDocuments({ status: "completed" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });

    res.json({
      success: true,
      stats: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy stats:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tải thống kê",
      error: error.message,
    });
  }
});

// ===================== EQUIPMENT APIs =====================

app.get("/api/equipment", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: equipment,
      count: equipment.length,
    });
  } catch (error) {
    console.error("Lỗi lấy thiết bị:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tải danh sách thiết bị",
      error: error.message,
    });
  }
});

app.post(
  "/api/equipment",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const equipment = new Equipment(req.body);
      await equipment.save();

      res.status(201).json({
        success: true,
        message: "Thêm thiết bị thành công",
        data: equipment,
      });
    } catch (error) {
      console.error("Lỗi thêm thiết bị:", error);
      res.status(400).json({
        success: false,
        message: "Lỗi khi thêm thiết bị",
        error: error.message,
      });
    }
  }
);

app.patch(
  "/api/equipment/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const equipment = await Equipment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thiết bị",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật thiết bị thành công",
        data: equipment,
      });
    } catch (error) {
      console.error("Lỗi cập nhật thiết bị:", error);
      res.status(400).json({
        success: false,
        message: "Lỗi khi cập nhật thiết bị",
        error: error.message,
      });
    }
  }
);

app.delete(
  "/api/equipment/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const equipment = await Equipment.findByIdAndDelete(req.params.id);

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thiết bị",
        });
      }

      res.json({
        success: true,
        message: "Xóa thiết bị thành công",
      });
    } catch (error) {
      console.error("Lỗi xóa thiết bị:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi xóa thiết bị",
        error: error.message,
      });
    }
  }
);

// ===================== PRODUCT APIs =====================

app.get("/api/products", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "popular":
        sortOption = { soldCount: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { soldCount: -1 };
    }

    const products = await Product.find(query).sort(sortOption);

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy sản phẩm",
      error: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("\n ================================");
  console.log(`   Server đang chạy tại: http://localhost:${PORT}`);
  console.log(" ================================");
  console.log(` API Base: http://localhost:${PORT}/api`);
  console.log(` Auth: /api/auth/login, /api/auth/register`);
  console.log(
    ` Forgot Password: /api/auth/forgot-password, /api/auth/reset-password`
  );
  console.log(` Profile: /api/auth/profile`);
  console.log(` Users: /api/users`);
  console.log(` Bookings: /api/bookings`);
  console.log(` Stats: /api/stats`);
  console.log(` Products: /api/products`);
  console.log(` Equipment: /api/equipment`);
  console.log(` Health: /api/health`);
  console.log(`🔐 Groq API: ${groq ? "Đã kết nối" : "Chưa có key"}`);
  console.log(" ================================\n");
});
