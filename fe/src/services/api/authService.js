import apiClient from "./client";

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Đăng nhập
   */
  async login(credentials) {
    const response = await apiClient.post("/auth/login", credentials);

    if (response.success && response.data) {
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    }

    throw new Error(response.message || "Đăng nhập thất bại");
  },

  /**
   * Đăng ký
   */
  async register(userData) {
    const response = await apiClient.post("/auth/register", userData);

    if (response.success && response.data) {
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    }

    throw new Error(response.message || "Đăng ký thất bại");
  },

  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  /**
   * Lấy profile
   */
  async getProfile() {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  /**
   * Cập nhật profile
   */
  async updateProfile(profileData) {
    const response = await apiClient.patch("/auth/profile", profileData);

    if (response.success && response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    }

    throw new Error(response.message || "Cập nhật thất bại");
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(passwordData) {
    const response = await apiClient.patch(
      "/auth/change-password",
      passwordData,
    );
    return response.data;
  },
};

export default authService;
