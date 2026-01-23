import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Groq from "groq-sdk";
import Booking from "./Booking.js";
import Product from "./Product.js";
import User from "./User.js";
import Equipment from "./Equipment.js";
import Order from "./Order.js";
import crypto from "crypto";
import { sendOTPEmail, sendPasswordResetConfirmation } from "./emailService.js";
import {
  createStripePaymentIntent,
  createVNPayPaymentUrl,
  createMoMoPayment,
  createPayOSPayment,
  verifyVNPayIPN,
  verifyMoMoIPN,
  verifyPayOSWebhook,
  calculateServicePrice,
} from "./paymentService.js";

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
      process.env.MONGODB_URI || "mongodb://localhost:27017/laundry-booking",
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

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    timestamp: new Date(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

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
      { expiresIn: "7d" },
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
      { expiresIn: "7d" },
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
    console.error("❌ Lỗi lấy profile:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin người dùng",
      error: error.message,
    });
  }
});

app.patch("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const { fullName, phone, address, email, password } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (email) updateData.email = email;

    // Nếu có password mới, hash nó
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
    console.error("❌ Lỗi cập nhật profile:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật thông tin",
      error: error.message,
    });
  }
});
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
  },
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
  },
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
  },
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
  },
);
const otpStore = new Map();

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email, phone, method } = req.body;

    let user;
    if (method === "email") {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập email",
        });
      }
      user = await User.findOne({ email });
    } else {
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập số điện thoại",
        });
      }
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản với thông tin này",
      });
    }

    // Tạo mã OTP 6 số
    const otp = crypto.randomInt(100000, 999999).toString();

    // Lưu OTP với thời gian hết hạn 10 phút
    const otpKey = method === "email" ? email : phone;
    otpStore.set(otpKey, {
      otp,
      userId: user._id,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 phút
    });

    // Gửi OTP
    if (method === "email") {
      const emailResult = await sendOTPEmail(email, otp, user.fullName);
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: "Lỗi khi gửi email. Vui lòng thử lại.",
        });
      }
    } else {
      // TODO: Implement SMS sending
      console.log(`📱 OTP for ${phone}: ${otp}`);
    }

    res.json({
      success: true,
      message: `Mã OTP đã được gửi đến ${
        method === "email" ? "email" : "số điện thoại"
      } của bạn`,
    });
  } catch (error) {
    console.error("❌ Lỗi forgot password:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xử lý yêu cầu",
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
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    // Lấy thông tin OTP từ store
    const otpKey = method === "email" ? email : phone;
    const otpData = otpStore.get(otpKey);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không tồn tại hoặc đã hết hạn",
      });
    }

    // Kiểm tra OTP có đúng không
    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không đúng",
      });
    }

    // Kiểm tra OTP có hết hạn chưa
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(otpKey);
      return res.status(400).json({
        success: false,
        message: "Mã OTP đã hết hạn",
      });
    }

    // Cập nhật mật khẩu mới
    const user = await User.findById(otpData.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    user.password = newPassword;
    await user.save();

    // Xóa OTP khỏi store
    otpStore.delete(otpKey);

    // Gửi email xác nhận (nếu là email)
    if (method === "email") {
      await sendPasswordResetConfirmation(email, user.fullName);
    }

    res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập.",
    });
  } catch (error) {
    console.error("❌ Lỗi reset password:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đặt lại mật khẩu",
      error: error.message,
    });
  }
});

setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of otpStore.entries()) {
      if (now > value.expiresAt) {
        otpStore.delete(key);
        console.log(`🗑️ Đã xóa OTP hết hạn: ${key}`);
      }
    }
  },
  15 * 60 * 1000,
);

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
      },
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
      { new: true },
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

app.patch(
  "/api/bookings/:id/payment-status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { paymentStatus, paymentDetails } = req.body;

      if (!paymentStatus) {
        return res.status(400).json({
          success: false,
          message: "Thiếu trạng thái thanh toán",
        });
      }

      const updateData = { paymentStatus };

      if (paymentDetails) {
        updateData.paymentDetails = paymentDetails;
      }

      // Nếu thanh toán thành công, tự động chuyển trạng thái đơn hàng
      if (paymentStatus === "paid") {
        updateData.status = "confirmed";
      }

      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true },
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
        message: "Đã cập nhật trạng thái thanh toán",
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thanh toán:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật trạng thái thanh toán",
        error: error.message,
      });
    }
  },
);

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
    // Calculate total amount based on service and additional options
    const { service, dryCleaningItems, useBag } = req.body;
    const totalAmount = calculateServicePrice(service, {
      dryCleaningItems,
      useBag,
    });

    const booking = new Booking({
      ...req.body,
      totalAmount,
      status: "pending",
      paymentStatus: req.body.paymentMethod === "cod" ? "unpaid" : "pending",
      createdAt: new Date(),
    });

    await booking.save();

    res.status(201).json({
      success: true,
      data: booking,
      message: "Đặt lịch thành công",
      totalAmount,
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
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tin nhắn",
      });
    }

    // Kiểm tra xem có Groq API key không
    if (!groq) {
      return res.json({
        success: true,
        reply:
          "Xin lỗi, chatbot chưa được cấu hình. Vui lòng thêm GROQ_API_KEY vào file .env",
      });
    }

    // Gọi Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Bạn là trợ lý ảo thân thiện của dịch vụ giặt là. Nhiệm vụ của bạn là:
          - Tên của bạn là Cấp.
          - Nếu người dùng có hỏi về muốn sử dụng chức năng nào đó hãy sinh ra link tới trang tương ứng trên website của chúng tôi.
- Tư vấn về các dịch vụ giặt là (giặt sấy, giặt khô, giặt ủi)
- Hướng dẫn cách đặt lịch
- Giải đáp thắc mắc về giá cả, thời gian
- Tư vấn về sản phẩm giặt là
Hãy trả lời ngắn gọn, thân thiện và hữu ích bằng tiếng Việt.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Xin lỗi, tôi không hiểu câu hỏi của bạn.";

    res.json({
      success: true,
      reply: reply,
    });
  } catch (error) {
    console.error("❌ Lỗi chat:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xử lý tin nhắn",
      reply: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
});
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
  },
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
        { new: true, runValidators: true },
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
  },
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
  },
);

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

// ===================== PAYMENT APIs =====================

// Create payment intent for Stripe
app.post("/api/payment/stripe/create-intent", async (req, res) => {
  try {
    const { amount, currency = "vnd", bookingId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số tiền không hợp lệ",
      });
    }

    const result = await createStripePaymentIntent(amount, currency, {
      bookingId: bookingId || "",
    });

    if (result.success) {
      res.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Không thể tạo payment intent",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Stripe Payment Intent Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo payment intent",
      error: error.message,
    });
  }
});

// Create VNPay payment URL
app.post("/api/payment/vnpay/create", async (req, res) => {
  try {
    const { bookingId, amount, orderInfo } = req.body;
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "127.0.0.1";

    if (!bookingId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Thông tin thanh toán không hợp lệ",
      });
    }

    const result = createVNPayPaymentUrl(
      bookingId,
      amount,
      orderInfo || "Thanh toán dịch vụ giặt là",
      ipAddr,
    );

    if (result.success) {
      res.json({
        success: true,
        paymentUrl: result.paymentUrl,
        orderId: result.orderId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Không thể tạo URL thanh toán VNPay",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("VNPay Payment URL Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo URL thanh toán VNPay",
      error: error.message,
    });
  }
});

// VNPay IPN (Instant Payment Notification)
app.post("/api/payment/vnpay/ipn", async (req, res) => {
  try {
    const vnp_Params = req.query;

    if (!verifyVNPayIPN(vnp_Params)) {
      return res.status(400).json({
        RspCode: "97",
        Message: "Invalid signature",
      });
    }

    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const transactionId = vnp_Params["vnp_TransactionNo"];
    const amount = parseInt(vnp_Params["vnp_Amount"]) / 100;

    // Update booking payment status
    const booking = await Booking.findById(orderId);
    if (!booking) {
      return res.status(404).json({
        RspCode: "01",
        Message: "Order not found",
      });
    }

    if (responseCode === "00") {
      // Payment successful
      booking.paymentStatus = "paid";
      booking.paymentDetails = {
        transactionId,
        paymentGateway: "vnpay",
        amount,
        currency: "VND",
        paidAt: new Date(),
        gatewayResponse: vnp_Params,
      };
      booking.status = "confirmed";
    } else {
      // Payment failed
      booking.paymentStatus = "failed";
      booking.paymentDetails = {
        paymentGateway: "vnpay",
        amount,
        currency: "VND",
        gatewayResponse: vnp_Params,
      };
    }

    await booking.save();

    res.json({
      RspCode: "00",
      Message: "Success",
    });
  } catch (error) {
    console.error("VNPay IPN Error:", error);
    res.status(500).json({
      RspCode: "99",
      Message: "System error",
    });
  }
});

// Create MoMo payment
app.post("/api/payment/momo/create", async (req, res) => {
  try {
    const { bookingId, amount, orderInfo } = req.body;

    if (!bookingId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Thông tin thanh toán không hợp lệ",
      });
    }

    const result = await createMoMoPayment(
      bookingId,
      amount,
      orderInfo || "Thanh toán dịch vụ giặt là",
    );

    if (result.success) {
      res.json({
        success: true,
        payUrl: result.payUrl,
        orderId: result.orderId,
        requestId: result.requestId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Không thể tạo thanh toán MoMo",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("MoMo Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo thanh toán MoMo",
      error: error.message,
    });
  }
});

// MoMo IPN (Instant Payment Notification)
app.post("/api/payment/momo/ipn", async (req, res) => {
  try {
    if (!verifyMoMoIPN(req.body)) {
      return res.status(400).json({
        resultCode: 97,
        message: "Invalid signature",
      });
    }

    const { orderId, resultCode, transId, amount } = req.body;

    // Update booking payment status
    const booking = await Booking.findById(orderId);
    if (!booking) {
      return res.status(404).json({
        resultCode: 1,
        message: "Order not found",
      });
    }

    if (resultCode === 0) {
      // Payment successful
      booking.paymentStatus = "paid";
      booking.paymentDetails = {
        transactionId: transId,
        paymentGateway: "momo",
        amount: parseInt(amount),
        currency: "VND",
        paidAt: new Date(),
        gatewayResponse: req.body,
      };
      booking.status = "confirmed";
    } else {
      // Payment failed
      booking.paymentStatus = "failed";
      booking.paymentDetails = {
        paymentGateway: "momo",
        amount: parseInt(amount),
        currency: "VND",
        gatewayResponse: req.body,
      };
    }

    await booking.save();

    res.json({
      resultCode: 0,
      message: "Success",
    });
  } catch (error) {
    console.error("MoMo IPN Error:", error);
    res.status(500).json({
      resultCode: 99,
      message: "System error",
    });
  }
});

// Create PayOS payment
app.post("/api/payment/payos/create", async (req, res) => {
  try {
    const { bookingId, amount, orderInfo, items } = req.body;

    if (!bookingId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Thông tin thanh toán không hợp lệ",
      });
    }

    const result = await createPayOSPayment(
      bookingId,
      amount,
      orderInfo || "Thanh toán dịch vụ giặt là",
      items,
    );

    if (result.success) {
      res.json({
        success: true,
        checkoutUrl: result.checkoutUrl,
        orderId: result.orderId,
        orderCode: result.orderCode,
        paymentLinkId: result.paymentLinkId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Không thể tạo thanh toán PayOS",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("PayOS Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo thanh toán PayOS",
      error: error.message,
    });
  }
});

// PayOS Webhook
app.post("/api/payment/payos/webhook", async (req, res) => {
  try {
    const webhookData = req.body;

    const verificationResult = await verifyPayOSWebhook(webhookData);

    if (!verificationResult.success) {
      return res.status(400).json({
        error: -1,
        message: "Invalid webhook signature",
        data: null,
      });
    }

    const { orderCode, amount, description, accountNumber, reference } =
      verificationResult.data;

    // Find booking by orderCode (you may need to store this mapping)
    const booking = await Booking.findOne({
      $or: [
        { _id: orderCode.toString() },
        { "paymentDetails.orderCode": orderCode },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        error: -1,
        message: "Order not found",
        data: null,
      });
    }

    // Update booking payment status based on webhook data
    if (verificationResult.data.code === "00") {
      // Payment successful
      booking.paymentStatus = "paid";
      booking.paymentDetails = {
        transactionId: reference,
        paymentGateway: "payos",
        amount: amount,
        currency: "VND",
        paidAt: new Date(),
        orderCode: orderCode,
        accountNumber: accountNumber,
        gatewayResponse: webhookData,
      };
      booking.status = "confirmed";
    } else {
      // Payment failed
      booking.paymentStatus = "failed";
      booking.paymentDetails = {
        paymentGateway: "payos",
        amount: amount,
        currency: "VND",
        orderCode: orderCode,
        gatewayResponse: webhookData,
      };
    }

    await booking.save();

    res.json({
      error: 0,
      message: "Success",
      data: null,
    });
  } catch (error) {
    console.error("PayOS Webhook Error:", error);
    res.status(500).json({
      error: -1,
      message: "System error",
      data: null,
    });
  }
});

// Calculate service price
app.post("/api/payment/calculate-price", (req, res) => {
  try {
    const { service, additionalServices = {} } = req.body;

    if (!service) {
      return res.status(400).json({
        success: false,
        message: "Loại dịch vụ không được để trống",
      });
    }

    const totalAmount = calculateServicePrice(service, additionalServices);

    res.json({
      success: true,
      totalAmount,
      breakdown: {
        service,
        basePrice: totalAmount,
        additionalServices,
      },
    });
  } catch (error) {
    console.error("Calculate Price Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tính toán giá dịch vụ",
      error: error.message,
    });
  }
});

// Get payment status
app.get("/api/payment/status/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      paymentDetails: booking.paymentDetails,
      totalAmount: booking.totalAmount,
    });
  } catch (error) {
    console.error("Get Payment Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy trạng thái thanh toán",
      error: error.message,
    });
  }
});

// ===================== PRODUCT PAYMENT APIs =====================

// Create Stripe payment intent for products
app.post("/api/payment/products/stripe/create-intent", async (req, res) => {
  try {
    const { amount, currency = "vnd", orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số tiền không hợp lệ",
      });
    }

    const result = await createStripePaymentIntent(amount, currency, {
      orderId: orderId || "",
      type: "product_purchase",
    });

    if (result.success) {
      res.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Không thể tạo payment intent",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Product Stripe Payment Intent Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo payment intent",
      error: error.message,
    });
  }
});

// Create VNPay payment URL for products
app.post("/api/payment/products/vnpay/create", async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "127.0.0.1";

    if (!orderId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Thông tin thanh toán không hợp lệ",
      });
    }

    const result = createVNPayPaymentUrl(
      orderId,
      amount,
      orderInfo || "Thanh toán mua sản phẩm",
      ipAddr,
    );

    if (result.success) {
      res.json({
        success: true,
        paymentUrl: result.paymentUrl,
        orderId: result.orderId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Không thể tạo URL thanh toán VNPay",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Product VNPay Payment URL Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo URL thanh toán VNPay",
      error: error.message,
    });
  }
});

// VNPay IPN for products
app.post("/api/payment/products/vnpay/ipn", async (req, res) => {
  try {
    const vnp_Params = req.query;

    if (!verifyVNPayIPN(vnp_Params)) {
      return res.status(400).json({
        RspCode: "97",
        Message: "Invalid signature",
      });
    }

    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const transactionId = vnp_Params["vnp_TransactionNo"];
    const amount = parseInt(vnp_Params["vnp_Amount"]) / 100;

    // Update order payment status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        RspCode: "01",
        Message: "Order not found",
      });
    }

    if (responseCode === "00") {
      // Payment successful
      order.paymentStatus = "paid";
      order.paymentDetails = {
        transactionId,
        paymentGateway: "vnpay",
        amount,
        currency: "VND",
        paidAt: new Date(),
        gatewayResponse: vnp_Params,
      };
      order.orderStatus = "confirmed";
    } else {
      // Payment failed
      order.paymentStatus = "failed";
      order.paymentDetails = {
        paymentGateway: "vnpay",
        amount,
        currency: "VND",
        gatewayResponse: vnp_Params,
      };
    }

    await order.save();

    res.json({
      RspCode: "00",
      Message: "Success",
    });
  } catch (error) {
    console.error("Product VNPay IPN Error:", error);
    res.status(500).json({
      RspCode: "99",
      Message: "System error",
    });
  }
});

// Create MoMo payment for products
app.post("/api/payment/products/momo/create", async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;

    if (!orderId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Thông tin thanh toán không hợp lệ",
      });
    }

    const result = await createMoMoPayment(
      orderId,
      amount,
      orderInfo || "Thanh toán mua sản phẩm",
    );

    if (result.success) {
      res.json({
        success: true,
        payUrl: result.payUrl,
        orderId: result.orderId,
        requestId: result.requestId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Không thể tạo thanh toán MoMo",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Product MoMo Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo thanh toán MoMo",
      error: error.message,
    });
  }
});

// MoMo IPN for products
app.post("/api/payment/products/momo/ipn", async (req, res) => {
  try {
    if (!verifyMoMoIPN(req.body)) {
      return res.status(400).json({
        resultCode: 97,
        message: "Invalid signature",
      });
    }

    const { orderId, resultCode, transId, amount } = req.body;

    // Update order payment status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        resultCode: 1,
        message: "Order not found",
      });
    }

    if (resultCode === 0) {
      // Payment successful
      order.paymentStatus = "paid";
      order.paymentDetails = {
        transactionId: transId,
        paymentGateway: "momo",
        amount: parseInt(amount),
        currency: "VND",
        paidAt: new Date(),
        gatewayResponse: req.body,
      };
      order.orderStatus = "confirmed";
    } else {
      // Payment failed
      order.paymentStatus = "failed";
      order.paymentDetails = {
        paymentGateway: "momo",
        amount: parseInt(amount),
        currency: "VND",
        gatewayResponse: req.body,
      };
    }

    await order.save();

    res.json({
      resultCode: 0,
      message: "Success",
    });
  } catch (error) {
    console.error("Product MoMo IPN Error:", error);
    res.status(500).json({
      resultCode: 99,
      message: "System error",
    });
  }
});

// Create PayOS payment for products
app.post("/api/payment/products/payos/create", async (req, res) => {
  try {
    const { orderId, amount, orderInfo, items } = req.body;

    if (!orderId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Thông tin thanh toán không hợp lệ",
      });
    }

    const result = await createPayOSPayment(
      orderId,
      amount,
      orderInfo || "Thanh toán mua sản phẩm",
      items,
    );

    if (result.success) {
      res.json({
        success: true,
        checkoutUrl: result.checkoutUrl,
        orderId: result.orderId,
        orderCode: result.orderCode,
        paymentLinkId: result.paymentLinkId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Không thể tạo thanh toán PayOS",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Product PayOS Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo thanh toán PayOS",
      error: error.message,
    });
  }
});

// PayOS Webhook for products
app.post("/api/payment/products/payos/webhook", async (req, res) => {
  try {
    const webhookData = req.body;

    const verificationResult = await verifyPayOSWebhook(webhookData);

    if (!verificationResult.success) {
      return res.status(400).json({
        error: -1,
        message: "Invalid webhook signature",
        data: null,
      });
    }

    const { orderCode, amount, description, accountNumber, reference } =
      verificationResult.data;

    // Find order by orderCode
    const order = await Order.findOne({
      $or: [
        { _id: orderCode.toString() },
        { "paymentDetails.orderCode": orderCode },
      ],
    });

    if (!order) {
      return res.status(404).json({
        error: -1,
        message: "Order not found",
        data: null,
      });
    }

    // Update order payment status based on webhook data
    if (verificationResult.data.code === "00") {
      // Payment successful
      order.paymentStatus = "paid";
      order.paymentDetails = {
        transactionId: reference,
        paymentGateway: "payos",
        amount: amount,
        currency: "VND",
        paidAt: new Date(),
        orderCode: orderCode,
        accountNumber: accountNumber,
        gatewayResponse: webhookData,
      };
      order.orderStatus = "confirmed";
    } else {
      // Payment failed
      order.paymentStatus = "failed";
      order.paymentDetails = {
        paymentGateway: "payos",
        amount: amount,
        currency: "VND",
        orderCode: orderCode,
        gatewayResponse: webhookData,
      };
    }

    await order.save();

    res.json({
      error: 0,
      message: "Success",
      data: null,
    });
  } catch (error) {
    console.error("Product PayOS Webhook Error:", error);
    res.status(500).json({
      error: -1,
      message: "System error",
      data: null,
    });
  }
});

// Get product order payment status
app.get("/api/payment/products/status/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      paymentDetails: order.paymentDetails,
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
    });
  } catch (error) {
    console.error("Get Product Payment Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy trạng thái thanh toán",
      error: error.message,
    });
  }
});

// ===================== ORDER APIs =====================

// Create order (for product purchases)
app.post("/api/orders", authenticateToken, async (req, res) => {
  console.log("📦 Creating new product order...");
  console.log("User ID:", req.user.id);
  console.log("Request body:", req.body);

  try {
    const {
      items,
      totalAmount,
      shippingFee,
      paymentMethod,
      notes,
      shippingAddress,
    } = req.body;

    if (!items || items.length === 0) {
      console.log("❌ No items in order");
      return res.status(400).json({
        success: false,
        message: "Đơn hàng phải có ít nhất 1 sản phẩm",
      });
    }

    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("❌ User not found:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    console.log("✅ User found:", user.fullName);

    // Validate products and calculate total
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      console.log("🔍 Validating product:", item.productId, item.name);

      const product = await Product.findById(item.productId);
      if (!product) {
        console.log("❌ Product not found:", item.productId);
        return res.status(400).json({
          success: false,
          message: `Không tìm thấy sản phẩm: ${item.name}`,
        });
      }

      if (product.stock < item.quantity) {
        console.log(
          "❌ Insufficient stock:",
          product.name,
          "Available:",
          product.stock,
          "Requested:",
          item.quantity,
        );
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${product.name} không đủ số lượng trong kho`,
        });
      }

      calculatedTotal += product.price * item.quantity;
      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      console.log("✅ Product validated:", product.name);
    }

    const finalTotal = calculatedTotal + (shippingFee || 0);
    console.log(
      "💰 Calculated total:",
      calculatedTotal,
      "Final total:",
      finalTotal,
    );

    const order = new Order({
      userId: req.user.id,
      customerInfo: {
        name: user.fullName,
        phone: user.phone,
        email: user.email,
        address: user.address,
      },
      items: validatedItems,
      totalAmount: finalTotal,
      shippingFee: shippingFee || 0,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "pending",
      orderStatus: "pending",
      orderType: "product_purchase",
      shippingAddress,
      notes: notes || "",
    });

    console.log("💾 Saving order to database...");
    await order.save();
    console.log("✅ Order saved with ID:", order._id);

    // Update product stock and sold count
    console.log("📦 Updating product stock...");
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: -item.quantity,
          soldCount: item.quantity,
        },
      });
      console.log("✅ Updated stock for:", item.name);
    }

    console.log("🎉 Order created successfully!");
    res.status(201).json({
      success: true,
      data: order,
      message: "Tạo đơn hàng thành công",
    });
  } catch (error) {
    console.error("❌ Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng",
      error: error.message,
    });
  }
});

// Get user orders
app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("items.productId", "name image category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
});

// Test endpoint to check orders
app.get(
  "/api/test/orders",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      console.log("🧪 Test endpoint - checking orders...");

      const orderCount = await Order.countDocuments();
      const sampleOrders = await Order.find().limit(3);

      console.log("🧪 Total orders in DB:", orderCount);
      console.log(
        "🧪 Sample orders:",
        sampleOrders.map((o) => ({
          id: o._id,
          status: o.orderStatus,
          total: o.totalAmount,
        })),
      );

      res.json({
        success: true,
        totalOrders: orderCount,
        sampleOrders: sampleOrders,
        message: "Test successful",
      });
    } catch (error) {
      console.error("🧪 Test error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Get all orders (Admin only)
app.get(
  "/api/admin/orders",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    console.log("📋 Admin fetching all orders...");

    try {
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;

      let query = {};
      if (status && status !== "all") {
        query.orderStatus = status;
      }

      console.log("📋 Query:", query);
      console.log("📋 Page:", page, "Limit:", limit);

      const orders = await Order.find(query)
        .populate("items.productId", "name image category")
        .populate("userId", "fullName email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Order.countDocuments(query);

      console.log("📋 Found", orders.length, "orders out of", total, "total");

      res.json({
        success: true,
        data: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("❌ Get Admin Orders Error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách đơn hàng",
        error: error.message,
      });
    }
  },
);

// Get order by ID
app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId", "name image category")
      .populate("userId", "fullName email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin đơn hàng",
      error: error.message,
    });
  }
});

// Update order status (Admin only)
app.patch(
  "/api/orders/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { orderStatus, trackingNumber, estimatedDelivery } = req.body;

      const updateData = { orderStatus };
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (estimatedDelivery)
        updateData.estimatedDelivery = new Date(estimatedDelivery);
      if (orderStatus === "delivered") updateData.deliveredAt = new Date();

      const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      res.json({
        success: true,
        data: order,
        message: "Cập nhật trạng thái đơn hàng thành công",
      });
    } catch (error) {
      console.error("Update Order Status Error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật trạng thái đơn hàng",
        error: error.message,
      });
    }
  },
);

// Update order payment status (Admin only)
app.patch(
  "/api/orders/:id/payment-status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { paymentStatus, paymentDetails } = req.body;

      if (!paymentStatus) {
        return res.status(400).json({
          success: false,
          message: "Thiếu trạng thái thanh toán",
        });
      }

      const updateData = { paymentStatus };

      if (paymentDetails) {
        updateData.paymentDetails = paymentDetails;
      }

      // Nếu thanh toán thành công, tự động chuyển trạng thái đơn hàng
      if (paymentStatus === "paid") {
        updateData.orderStatus = "confirmed";
      }

      const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      res.json({
        success: true,
        data: order,
        message: "Cập nhật trạng thái thanh toán thành công",
      });
    } catch (error) {
      console.error("Update Order Payment Status Error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật trạng thái thanh toán",
        error: error.message,
      });
    }
  },
);

// Cancel order
app.patch("/api/orders/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Check if user owns the order or is admin
    if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền hủy đơn hàng này",
      });
    }

    // Only allow cancellation for pending/confirmed orders
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy đơn hàng đã được xử lý",
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: item.quantity,
          soldCount: -item.quantity,
        },
      });
    }

    order.orderStatus = "cancelled";
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }

    await order.save();

    res.json({
      success: true,
      data: order,
      message: "Hủy đơn hàng thành công",
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy đơn hàng",
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
app.listen(PORT, () => {});
