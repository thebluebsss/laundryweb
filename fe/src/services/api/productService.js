import apiClient from "./client";

/**
 * Product Service - Quản lý sản phẩm
 */
export const productService = {
  /**
   * Lấy danh sách products
   */
  async getProducts(params = {}) {
    const response = await apiClient.get("/products", params);
    return response.data;
  },

  /**
   * Lấy chi tiết product
   */
  async getProductById(id) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Tạo product mới (Admin only)
   */
  async createProduct(productData) {
    const response = await apiClient.post("/products", productData);
    return response.data;
  },

  /**
   * Cập nhật product
   */
  async updateProduct(id, productData) {
    const response = await apiClient.patch(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Xóa product
   */
  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Cập nhật stock
   */
  async updateStock(id, quantity) {
    const response = await apiClient.patch(`/products/${id}/stock`, {
      quantity,
    });
    return response.data;
  },
};

export default productService;
