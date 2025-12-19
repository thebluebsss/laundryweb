import express from "express";
import Product from "../models/Product.js";

const router = express.Router();
router.get("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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
    console.error("Lỗi lấy sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});
router.get("/recommendations/:serviceType", async (req, res) => {
  try {
    const { serviceType } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    const products = await Product.find({
      isActive: true,
      $or: [{ recommendFor: serviceType }, { recommendFor: "all" }],
    })
      .sort({ soldCount: -1, rating: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: products,
      serviceType,
    });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm gợi ý:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

router.get("/featured/bestsellers", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ isActive: true })
      .sort({ soldCount: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm bán chạy:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

router.get("/featured/new", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm mới:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

router.get("/featured/discounted", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({
      isActive: true,
      originalPrice: { $exists: true, $ne: null },
      $expr: { $gt: ["$originalPrice", "$price"] },
    })
      .sort({ soldCount: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm giảm giá:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    res.status(400).json({
      success: false,
      message: "Lỗi tạo sản phẩm",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
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
    console.error("Lỗi cập nhật sản phẩm:", error);
    res.status(400).json({
      success: false,
      message: "Lỗi cập nhật sản phẩm",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi xóa sản phẩm",
      error: error.message,
    });
  }
});

router.patch("/:id/stock", async (req, res) => {
  try {
    const { quantity, action } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    if (action === "add") {
      product.stock += quantity;
    } else if (action === "subtract") {
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Không đủ hàng trong kho",
        });
      }
      product.stock -= quantity;
    }

    await product.save();

    res.json({
      success: true,
      message: "Cập nhật tồn kho thành công",
      data: product,
    });
  } catch (error) {
    console.error("Lỗi cập nhật tồn kho:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi cập nhật tồn kho",
      error: error.message,
    });
  }
});

export default router;
