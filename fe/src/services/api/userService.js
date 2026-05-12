import apiClient from "./client";

/**
 * User Service - Quản lý người dùng
 */
export const userService = {
  /**
   * Lấy danh sách users (Admin only)
   */
  async getUsers(params = {}) {
    const response = await apiClient.get("/users", params);
    return response.data;
  },

  /**
   * Lấy chi tiết user
   */
  async getUserById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Tạo user mới (Admin only)
   */
  async createUser(userData) {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },

  /**
   * Cập nhật user
   */
  async updateUser(id, userData) {
    const response = await apiClient.patch(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Xóa user
   */
  async deleteUser(id) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Toggle trạng thái active
   */
  async toggleUserActive(id) {
    const response = await apiClient.patch(`/users/${id}/toggle-active`);
    return response.data;
  },

  /**
   * Lấy thống kê users (Admin only)
   */
  async getStats() {
    const response = await apiClient.get("/users-stats");
    return response.data;
  },
};

export default userService;
