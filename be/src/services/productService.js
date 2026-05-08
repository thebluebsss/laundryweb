import Product from "../models/Product.js";
import { NotFoundError } from "../utils/errorHandler.js";

/**
 * Lấy danh sách products với filters
 */
export const getProducts = async (filters = {}) => {
  const query = {};

  // Filters
  if (filters.category) query.category = filters.category;
  if (filters.isActive !== undefined) query.isActive = filters.isActive;
  if (filters.tags) query.tags = { $in: filters.tags.split(",") };

  // Search
  if (filters.search) {
    query.$or = [
      { name: new RegExp(filters.search, "i") },
      { description: new RegExp(filters.search, "i") },
      { brand: new RegExp(filters.search, "i") },
    ];
  }

  // Sort
  let sort = { createdAt: -1 };
  if (filters.sort === "price-asc") sort = { price: 1 };
  if (filters.sort === "price-desc") sort = { price: -1 };
  if (filters.sort === "popular") sort = { soldCount: -1 };
  if (filters.sort === "rating") sort = { rating: -1 };

  const products = await Product.find(query).sort(sort);

  return products;
};

/**
 * Lấy chi tiết product
 */
export const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product không tồn tại");
  }
  return product;
};

/**
 * Tạo product mới
 */
export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

/**
 * Cập nhật product
 */
export const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!product) {
    throw new NotFoundError("Product không tồn tại");
  }

  return product;
};

/**
 * Xóa product
 */
export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new NotFoundError("Product không tồn tại");
  }
  return product;
};

/**
 * Lấy product recommendations
 */
export const getRecommendations = async (service) => {
  const products = await Product.find({
    isActive: true,
    recommendFor: service,
  })
    .sort({ soldCount: -1 })
    .limit(4);

  return products;
};
