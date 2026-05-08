import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/response.js";
import * as productService from "../services/productService.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts(req.query);
  successResponse(res, products, "Lấy danh sách products thành công");
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  successResponse(res, product, "Lấy chi tiết product thành công");
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  successResponse(res, product, "Tạo product thành công", 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  successResponse(res, product, "Cập nhật product thành công");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  successResponse(res, null, "Xóa product thành công");
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const { service } = req.query;
  const { bookingId } = req.params;

  // Nếu có bookingId, lấy service từ booking
  let serviceType = service;
  if (bookingId && !service) {
    const bookingService = await import("../services/bookingService.js");
    const booking = await bookingService.getBookingById(bookingId);
    serviceType = booking.service;
  }

  const products = await productService.getRecommendations(serviceType);
  successResponse(res, products, "Lấy recommendations thành công");
});
