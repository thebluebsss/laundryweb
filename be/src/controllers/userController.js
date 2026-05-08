import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/response.js";
import * as userService from "../services/userService.js";

export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, role, isActive } = req.query;
  const filters = { search, role, isActive };
  const result = await userService.getUsers(
    filters,
    parseInt(page) || 1,
    parseInt(limit) || 10,
  );
  successResponse(res, result, "Lấy danh sách users thành công");
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  successResponse(res, user, "Lấy chi tiết user thành công");
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  successResponse(res, user, "Tạo user thành công", 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  successResponse(res, user, "Cập nhật user thành công");
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  successResponse(res, null, "Xóa user thành công");
});

export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await userService.toggleUserActive(req.params.id);
  successResponse(res, user, "Cập nhật trạng thái thành công");
});

export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await userService.getUserStats();
  successResponse(res, stats, "Lấy thống kê thành công");
});
