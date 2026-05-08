import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/response.js";
import * as orderService from "../services/orderService.js";

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user._id);
  successResponse(res, order, "Tạo order thành công", 201);
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await orderService.getUserOrders(
    req.user._id,
    parseInt(page) || 1,
    parseInt(limit) || 10,
  );
  successResponse(res, result, "Lấy danh sách orders thành công");
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, orderStatus, paymentStatus } = req.query;
  const filters = { orderStatus, paymentStatus };
  const result = await orderService.getAllOrders(
    filters,
    parseInt(page) || 1,
    parseInt(limit) || 10,
  );
  successResponse(res, result, "Lấy danh sách orders thành công");
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  successResponse(res, order, "Lấy chi tiết order thành công");
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const order = await orderService.updateOrderStatus(
    req.params.id,
    orderStatus,
  );
  successResponse(res, order, "Cập nhật trạng thái thành công");
});

export const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;
  const order = await orderService.updateOrderPaymentStatus(
    req.params.id,
    paymentStatus,
    paymentDetails,
  );
  successResponse(res, order, "Cập nhật trạng thái thanh toán thành công");
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const order = await orderService.cancelOrder(
    req.params.id,
    req.user._id,
    isAdmin,
  );
  successResponse(res, order, "Hủy order thành công");
});
