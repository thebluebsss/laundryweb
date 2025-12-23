import React, { useState, useEffect } from "react";
import "./ProductRecommendations.css";

function ProductRecommendations({ bookingId, products }) {
  const [recommendedProducts, setRecommendedProducts] = useState(
    products || []
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!products && bookingId) {
      fetchRecommendations();
    }
  }, [bookingId]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `https://laundryweb-b74z.onrender.com/api/recommendations/${bookingId}`
      );
      const data = await response.json();
      if (data.success) {
        setRecommendedProducts(data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy sản phẩm gợi ý:", error);
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

  if (!isVisible || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="product-recommendations">
      <div className="recommendations-header">
        <h3>Sản phẩm dành cho bạn</h3>
        <p>Tăng hiệu quả giặt giũ với những sản phẩm chất lượng cao</p>
        <button
          className="close-recommendations"
          onClick={() => setIsVisible(false)}
        >
          ✕
        </button>
      </div>

      <div className="products-grid">
        {recommendedProducts.map((product) => {
          const discount = calculateDiscount(
            product.originalPrice,
            product.price
          );

          return (
            <div key={product._id} className="product-card">
              {discount > 0 && (
                <span className="discount-badge">-{discount}%</span>
              )}

              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="placeholder-image">
                    {product.category === "detergent"}
                    {product.category === "softener"}
                    {product.category === "bleach"}
                    {product.category === "bag"}
                    {product.category === "accessory"}
                  </div>
                )}
              </div>

              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-description">{product.description}</p>

                {product.weight && (
                  <span className="product-weight">{product.weight}</span>
                )}

                <div className="product-rating">
                  {"⭐".repeat(Math.floor(product.rating))}
                  <span className="sold-count">
                    Đã bán: {product.soldCount || 0}
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

                <button className="add-to-cart-btn">🛒 Thêm vào giỏ</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductRecommendations;
