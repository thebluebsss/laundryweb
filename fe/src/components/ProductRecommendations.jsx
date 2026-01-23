import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  Grid,
  Alert,
} from "@mui/material";
import { Add, Remove, ShoppingCart, Close } from "@mui/icons-material";
import { useCart } from "../contexts/CartContext";
import config from "../config/api";

const API_BASE_URL = config.API_BASE_URL;

function ProductRecommendations({ bookingId, products }) {
  const [recommendedProducts, setRecommendedProducts] = useState(
    products || [],
  );
  const [isVisible, setIsVisible] = useState(true);
  const { addItem, getItemQuantity, updateQuantity } = useCart();

  useEffect(() => {
    if (!products && bookingId) {
      fetchRecommendations();
    }
  }, [bookingId]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/recommendations/${bookingId}`,
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

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleQuantityChange = (product, newQuantity) => {
    if (newQuantity <= 0) {
      updateQuantity(product._id, 0);
    } else {
      updateQuantity(product._id, newQuantity);
    }
  };

  const getProductImage = (product) => {
    if (product.image) {
      return product.image;
    }

    // Default icons based on category
    const categoryIcons = {
      detergent: "🧴",
      softener: "💧",
      bleach: "🧪",
      bag: "👜",
      accessory: "🔧",
    };

    return categoryIcons[product.category] || "📦";
  };

  if (!isVisible || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            🛍️ Sản phẩm dành cho bạn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tăng hiệu quả giặt giũ với những sản phẩm chất lượng cao
          </Typography>
        </Box>
        <IconButton onClick={() => setIsVisible(false)}>
          <Close />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {recommendedProducts.map((product) => {
          const discount = calculateDiscount(
            product.originalPrice,
            product.price,
          );
          const quantity = getItemQuantity(product._id);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                {discount > 0 && (
                  <Chip
                    label={`-${discount}%`}
                    color="error"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      fontWeight: "bold",
                    }}
                  />
                )}

                <CardMedia
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                    fontSize: "4rem",
                  }}
                >
                  {typeof getProductImage(product) === "string" &&
                  getProductImage(product).startsWith("http") ? (
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography variant="h1">
                      {getProductImage(product)}
                    </Typography>
                  )}
                </CardMedia>

                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.description}
                  </Typography>

                  {product.weight && (
                    <Chip
                      label={product.weight}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1, alignSelf: "flex-start" }}
                    />
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {"⭐".repeat(Math.floor(product.rating || 5))}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Đã bán: {product.soldCount || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatPrice(product.price)}
                    </Typography>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {formatPrice(product.originalPrice)}
                        </Typography>
                      )}
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    {quantity === 0 ? (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(product)}
                        sx={{
                          bgcolor: "#4CAF50",
                          "&:hover": { bgcolor: "#45a049" },
                        }}
                      >
                        Thêm vào giỏ
                      </Button>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(product, quantity - 1)
                          }
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Remove />
                        </IconButton>

                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ mx: 2 }}
                        >
                          {quantity}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(product, quantity + 1)
                          }
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        💡 <strong>Mẹo:</strong> Mua cùng lúc để tiết kiệm phí vận chuyển! Miễn
        phí vận chuyển cho đơn hàng từ 500,000 VND.
      </Alert>
    </Box>
  );
}

export default ProductRecommendations;
