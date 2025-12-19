import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import Booking from "./Booking.js";
import Product from "./Product.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/laundry-booking"
    );
    console.log("MongoDB đã kết nối thành công!");
  } catch (error) {
    console.error(" Lỗi kết nối MongoDB:", error.message);
  }
};

connectDB();

let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

const SYSTEM_PROMPT = `Bạn là trợ lý AI thân thiện của dịch vụ giặt ủi. Nhiệm vụ của bạn:

📋 THÔNG TIN DỊCH VỤ:
1. Giặt hấp/sấy khô (15.000đ/kg - giặt + sấy + gấp)
2. Giặt ủi (20.000đ/kg - giặt + ủi + gấp)
3. Giặt hơi nước (18.000đ/kg - giặt hơi nước + sấy)
4. Giặt khô (Dry Clean) - từ 50.000đ/món tùy loại vải

🎯 ƯU ĐÃI:
- Giặt từ 5kg: giảm 5%
- Giặt từ 10kg: giảm 10%
- Khách hàng thân thiết: giảm thêm 5%

⏰ THỜI GIAN:
- Giặt hấp/sấy: 24h
- Giặt ủi: 48h
- Giặt khô: 3-5 ngày

📍 DỊCH VỤ BỔ SUNG:
- Nhận/giao tận nơi miễn phí (trong bán kính 5km)
- Giặt gấp 24h: +50% phí
- Sử dụng túi chuyên dụng: +5.000đ

🧴 LỰA CHỌN:
- Nước giặt: Omo, Ariel, Tide
- Nước xả: Comfort, Downy
- Chất tẩy: Có/Không

🛍️ SẢN PHẨM BÁN KÈM:
- Bột giặt cao cấp: Omo, Ariel, Tide (từ 89.000đ)
- Nước xả vải: Comfort, Downy (từ 65.000đ)
- Túi giặt chuyên dụng: 25.000đ
- Phụ kiện giặt ủi khác

CÁCH TRẢ LỜI:
- Thân thiện, nhiệt tình
- Trả lời ngắn gọn, dễ hiểu
- Gợi ý dịch vụ phù hợp
- Hướng dẫn đặt lịch nếu khách hỏi
- Tư vấn sản phẩm nếu khách quan tâm
- Không bịa đặt thông tin không có

Nếu khách hỏi về đặt lịch, hãy nói: "Bạn có thể đặt lịch ngay trên website hoặc gọi hotline để được hỗ trợ nhanh hơn nhé!"
Nếu khách hỏi về sản phẩm, hãy giới thiệu các sản phẩm phù hợp.`;

const getRecommendedProducts = async (booking) => {
  try {
    const recommendations = [];

    const serviceType = booking.service.toLowerCase();

    if (serviceType.includes("giặt") || serviceType.includes("wash")) {
      const detergents = await Product.find({
        category: "detergent",
        isActive: true,
      })
        .limit(2)
        .sort({ soldCount: -1 });

      const softeners = await Product.find({
        category: "softener",
        isActive: true,
      })
        .limit(1)
        .sort({ soldCount: -1 });

      recommendations.push(...detergents, ...softeners);
    }

    if (serviceType.includes("khô") || serviceType.includes("dry")) {
      const bags = await Product.find({
        category: "bag",
        isActive: true,
      }).limit(2);

      recommendations.push(...bags);
    }

    if (booking.useBag === "Không" || !booking.useBag) {
      const bag = await Product.findOne({
        category: "bag",
        isActive: true,
      }).sort({ soldCount: -1 });

      if (bag && !recommendations.find((p) => p._id.equals(bag._id))) {
        recommendations.push(bag);
      }
    }

    const accessories = await Product.find({
      category: "accessory",
      isActive: true,
    })
      .limit(1)
      .sort({ rating: -1 });

    recommendations.push(...accessories);

    const uniqueProducts = recommendations
      .filter(
        (product, index, self) =>
          index === self.findIndex((p) => p._id.equals(product._id))
      )
      .slice(0, 4);

    return uniqueProducts;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm gợi ý:", error);
    return [];
  }
};

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 Nhận tin nhắn:", message);

    if (!groq) {
      return res.json({
        reply: "⚠️ Chatbot chưa được cấu hình. Vui lòng liên hệ admin.",
      });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content;
    console.log(" Bot trả lời:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    return res.json({
      reply: "Xin lỗi, tôi đang gặp sự cố vui lòng thử lại sau ",
    });
  }
});

app.post("/api/create-booking", async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      service,
      pickupDate,
      deliveryDate,
      detergent,
      bleach,
      useBag,
      dryCleaningItems,
      notes,
      paymentMethod,
    } = req.body;

    if (!name || !phone || !address || !service) {
      return res.status(400).json({
        success: false,
        message:
          "Vui lòng điền đầy đủ thông tin bắt buộc (tên, số điện thoại, địa chỉ, dịch vụ)",
      });
    }

    const newBooking = new Booking({
      name,
      phone,
      address,
      service,
      pickupDate: pickupDate || null,
      deliveryDate: deliveryDate || null,
      detergent: detergent || "Omo",
      bleach: bleach || "Sử dụng",
      useBag: useBag || "Có",
      dryCleaningItems: dryCleaningItems || false,
      notes: notes || "",
      paymentMethod: paymentMethod || "cod",
      status: "pending",
      paymentStatus: "unpaid",
    });

    await newBooking.save();

    console.log("✅ Đơn hàng mới:", newBooking._id);

    const recommendedProducts = await getRecommendedProducts(newBooking);

    if (paymentMethod === "online") {
      return res.status(201).json({
        success: true,
        message: "Đơn hàng đã được tạo! Đang chuyển đến trang thanh toán...",
        booking: newBooking,
        recommendedProducts,
        paymentUrl: `http://localhost:3000/payment?bookingId=${newBooking._id}`,
      });
    }

    res.status(201).json({
      success: true,
      message: "Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.",
      booking: newBooking,
      recommendedProducts,
    });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments();

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn hàng",
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
    console.error(" Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin đơn hàng",
      error: error.message,
    });
  }
});

app.get("/api/bookings/phone/:phone", async (req, res) => {
  try {
    const bookings = await Booking.find({ phone: req.params.phone }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error(" Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm đơn hàng",
      error: error.message,
    });
  }
});

app.patch("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: booking,
    });
  } catch (error) {
    console.error(" Lỗi:", error);
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
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa đơn hàng",
      error: error.message,
    });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: "pending" });
    const confirmed = await Booking.countDocuments({ status: "confirmed" });
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
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê",
      error: error.message,
    });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    const query = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const products = await Product.find(query)
      .sort({ soldCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Lỗi lấy sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách sản phẩm",
      error: error.message,
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin sản phẩm",
      error: error.message,
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo sản phẩm",
      error: error.message,
    });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
      error: error.message,
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm",
      error: error.message,
    });
  }
});

app.get("/api/recommendations/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    const recommendations = await getRecommendedProducts(booking);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy sản phẩm gợi ý",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "🧺 Laundry Booking API với Chatbot & Shop",
    hasGroqAPI: !!groq,
    endpoints: {
      "POST /api/chat": "Chatbot AI",
      "POST /api/create-booking": "Tạo đơn hàng mới",
      "GET /api/bookings": "Lấy danh sách đơn hàng",
      "GET /api/bookings/:id": "Lấy đơn hàng theo ID",
      "GET /api/bookings/phone/:phone": "Tìm đơn hàng theo SĐT",
      "PATCH /api/bookings/:id/status": "Cập nhật trạng thái",
      "DELETE /api/bookings/:id": "Xóa đơn hàng",
      "GET /api/stats": "Thống kê",
      "GET /api/products": "Danh sách sản phẩm",
      "GET /api/products/:id": "Chi tiết sản phẩm",
      "POST /api/products": "Tạo sản phẩm (Admin)",
      "PATCH /api/products/:id": "Cập nhật sản phẩm (Admin)",
      "DELETE /api/products/:id": "Xóa sản phẩm (Admin)",
      "GET /api/recommendations/:bookingId": "Gợi ý sản phẩm cho đơn hàng",
    },
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`Groq API: ${groq ? "Đã kết nối ✓" : "Chưa có key ✗"}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/create-booking\n`);
});
