import React, { useState, useEffect } from "react";
import "./ProductsPage.css";
import config from "../config/api";

const API_BASE_URL = config.API_BASE_URL;

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("laundry_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCartModal, setShowCartModal] = useState(false);

  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "detergent", label: "Bột/Nước giặt" },
    { value: "softener", label: "Nước xả" },
    { value: "bleach", label: "Chất tẩy" },
    { value: "bag", label: "Túi giặt" },
    { value: "accessory", label: "Phụ kiện" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, currentPage]);

  useEffect(() => {
    localStorage.setItem("laundry_cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
      });

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`${API_BASE_URL}/products?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success && data.data) {
        setProducts(data.data);
        setFilteredProducts(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        console.error("API không trả về dữ liệu đúng:", data);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      alert(
        "Không thể tải sản phẩm. Vui lòng kiểm tra:\n1. Server đang chạy (port 3001)\n2. Đã chạy seedProduct.js\n3. MongoDB đã kết nối"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateDiscount = (original, current) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
    showNotification("Đã xóa sản phẩm khỏi giỏ hàng!");
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    const confirmOrder = window.confirm(
      `Xác nhận thanh toán?\n\n` +
        `Tổng số sản phẩm: ${getTotalItems()}\n` +
        `Tổng tiền: ${formatPrice(getTotalPrice())}\n\n` +
        `Bạn có muốn tiếp tục?`
    );

    if (confirmOrder) {
      setCart([]);
      setShowCartModal(false);
      alert(
        "✅ Đặt hàng thành công!\n\nChúng tôi sẽ liên hệ với bạn sớm nhất."
      );
    }
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && products.length === 0) {
    return (
      <div className="products-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header */}
      <div className="products-header">
        <h1>🛍️ Sản phẩm chất lượng cao</h1>
        <p>Mua sắm tiện lợi - Giao hàng miễn phí khi đặt lịch giặt ủi</p>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="cart-summary" onClick={() => setShowCartModal(true)}>
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{getTotalItems()} sản phẩm</span>
          <button className="view-cart-btn">Xem giỏ hàng</button>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div
          className="cart-modal-overlay"
          onClick={() => setShowCartModal(false)}
        >
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h2>🛒 Giỏ hàng của bạn</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowCartModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="cart-modal-body">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>😔 Giỏ hàng trống</p>
                  <button
                    className="continue-shopping-btn"
                    onClick={() => setShowCartModal(false)}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item._id} className="cart-item">
                        <div className="cart-item-image">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className="cart-placeholder-image">
                              {item.category === "detergent" && "🧴"}
                              {item.category === "softener" && "💧"}
                              {item.category === "bleach" && "🧪"}
                              {item.category === "bag" && "👜"}
                              {item.category === "accessory" && "✨"}
                            </div>
                          )}
                        </div>

                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <p className="cart-item-brand">{item.brand}</p>
                          <p className="cart-item-price">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="cart-item-actions">
                          <div className="quantity-control">
                            <button
                              className="qty-btn"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="remove-btn"
                            onClick={() => removeFromCart(item._id)}
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="cart-item-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-modal-footer">
                    <div className="cart-summary-info">
                      <div className="summary-row">
                        <span>Tạm tính:</span>
                        <span className="summary-value">
                          {formatPrice(getTotalPrice())}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span>Phí vận chuyển:</span>
                        <span className="summary-value free">Miễn phí</span>
                      </div>
                      <div className="summary-row total">
                        <span>Tổng cộng:</span>
                        <span className="summary-value">
                          {formatPrice(getTotalPrice())}
                        </span>
                      </div>
                    </div>

                    <div className="cart-actions">
                      <button
                        className="continue-shopping-btn"
                        onClick={() => setShowCartModal(false)}
                      >
                        Tiếp tục mua sắm
                      </button>
                      <button className="checkout-btn" onClick={handleCheckout}>
                        💳 Thanh toán ngay
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="products-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`category-btn ${
                selectedCategory === cat.value ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(cat.value)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>😔 Không tìm thấy sản phẩm nào</p>
          <button
            className="reset-filter-btn"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const discount = calculateDiscount(
                product.originalPrice,
                product.price
              );

              return (
                <div key={product._id} className="product-card">
                  {discount > 0 && (
                    <span className="discount-badge">-{discount}%</span>
                  )}

                  {product.stock < 10 && product.stock > 0 && (
                    <span className="stock-badge">Còn {product.stock}</span>
                  )}

                  {product.stock === 0 && (
                    <span className="out-of-stock-badge">Hết hàng</span>
                  )}

                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="placeholder-image">
                        {product.category === "detergent" && "🧴"}
                        {product.category === "softener" && "💧"}
                        {product.category === "bleach" && "🧪"}
                        {product.category === "bag" && "👜"}
                        {product.category === "accessory" && "✨"}
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    {product.brand && (
                      <span className="product-brand">{product.brand}</span>
                    )}

                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>

                    {product.weight && (
                      <span className="product-weight">{product.weight}</span>
                    )}

                    <div className="product-rating">
                      {"⭐".repeat(Math.floor(product.rating))}
                      <span className="rating-value">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="sold-count">
                        • Đã bán: {product.soldCount || 0}
                      </span>
                    </div>

                    <div className="product-price">
                      <span className="current-price">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="original-price">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                    </div>

                    <button
                      className={`add-to-cart-btn ${
                        product.stock === 0 ? "disabled" : ""
                      }`}
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? "❌ Hết hàng" : "🛒 Thêm vào giỏ"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>

              <div className="page-numbers">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        className={`page-btn ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      {/* Promotion Banner */}
      <div className="promotion-banner">
        <h3>💡 Mẹo tiết kiệm</h3>
        <p>
          Mua kèm sản phẩm khi đặt lịch giặt ủi để được{" "}
          <strong>miễn phí vận chuyển!</strong>
        </p>
        <button
          className="booking-btn"
          onClick={() => (window.location.href = "/dat-lich")}
        >
          Đặt lịch giặt ủi ngay
        </button>
      </div>
    </div>
  );
}

export default ProductsPage;
