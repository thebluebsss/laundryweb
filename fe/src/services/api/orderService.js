import apiClient from "./client";

/**
 * Order Service - Quản lý đơn hàng sản phẩm
 */
export const orderService = {
  /**
   * Lấy danh sách orders của user hiện tại
   */
  async getMyOrders(params = {}) {
    const response = await apiClient.get("/orders", params);
    return response.data;
  },

  /**
   * Lấy tất cả orders (Admin only)
   */
  async getAllOrders(params = {}) {
    const response = await apiClient.get("/admin/orders", params);
    return response.data;
  },

  /**
   * Lấy chi tiết order
   */
  async getOrderById(id) {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Tạo order mới
   */
  async createOrder(orderData) {
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  },

  /**
   * Cập nhật trạng thái order
   */
  async updateOrderStatus(id, orderStatus) {
    const response = await apiClient.patch(`/orders/${id}/status`, {
      orderStatus,
    });
    return response.data;
  },

  /**
   * Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(id, paymentStatus, paymentDetails = {}) {
    const response = await apiClient.patch(`/orders/${id}/payment-status`, {
      paymentStatus,
      paymentDetails,
    });
    return response.data;
  },

  /**
   * Hủy order
   */
  async cancelOrder(id) {
    const response = await apiClient.patch(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;
