import apiClient from "./client";

/**
 * Booking Service - Quản lý đơn dịch vụ giặt là
 */
export const bookingService = {
  /**
   * Lấy danh sách bookings của user hiện tại
   */
  async getMyBookings(params = {}) {
    const response = await apiClient.get("/bookings/my", params);
    return response.data;
  },

  /**
   * Lấy tất cả bookings (Admin only)
   */
  async getAllBookings(params = {}) {
    const response = await apiClient.get("/bookings", params);
    return response.data;
  },

  /**
   * Lấy chi tiết booking
   */
  async getBookingById(id) {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Tìm booking theo số điện thoại
   */
  async getBookingsByPhone(phone) {
    const response = await apiClient.get(`/bookings/phone/${phone}`);
    return response.data;
  },

  /**
   * Tạo booking mới
   */
  async createBooking(bookingData) {
    const response = await apiClient.post("/bookings", bookingData);
    return response.data;
  },

  /**
   * Cập nhật trạng thái booking
   */
  async updateBookingStatus(id, status) {
    const response = await apiClient.patch(`/bookings/${id}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(id, paymentStatus, paymentDetails = {}) {
    const response = await apiClient.patch(`/bookings/${id}/payment-status`, {
      paymentStatus,
      paymentDetails,
    });
    return response.data;
  },

  /**
   * Xóa booking
   */
  async deleteBooking(id) {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Lấy thống kê bookings (Admin only)
   */
  async getStats() {
    const response = await apiClient.get("/stats");
    return response.data;
  },
};

export default bookingService;
