import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
  TextField,
  Alert,
  Slide,
  Fade,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Payment,
  Close,
} from "@mui/icons-material";
import { useCart } from "../contexts/CartContext";
import ProductPaymentProcessor from "./ProductPaymentProcessor";

const CartDrawer = ({ open, onClose }) => {
  console.log("🛒 CartDrawer rendered with open:", open);

  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  console.log("🛒 Cart items:", items);

  const [showPayment, setShowPayment] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginDialog(true);
      return;
    }

    if (items.length === 0) {
      return;
    }

    console.log("Starting checkout with items:", items);
    console.log("Total price:", getTotalPrice());
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPayment(false);
    onClose();

    // Show success notification
    if (window.showSuccessNotification) {
      window.showSuccessNotification(
        "Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại cửa hàng.",
      );
    }
  };

  const getProductImage = (product) => {
    if (product.image) {
      return product.image;
    }

    const categoryIcons = {
      detergent: "🧴",
      softener: "💧",
      bleach: "🧪",
      bag: "👜",
      accessory: "🔧",
    };

    return categoryIcons[product.category] || "📦";
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            background: "linear-gradient(135deg, #fafbfc 0%, #f7fafc 100%)",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ShoppingCart />
                <Typography variant="h6" fontWeight="bold">
                  Giỏ hàng ({getTotalItems()} sản phẩm)
                </Typography>
              </Box>
              <IconButton onClick={onClose} sx={{ color: "white" }}>
                <Close />
              </IconButton>
            </Box>
          </Paper>

          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Cart Items */}
            {items.length === 0 ? (
              <Fade in timeout={500}>
                <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
                  <ShoppingCart
                    sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Giỏ hàng trống
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thêm sản phẩm để bắt đầu mua sắm
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <>
                <List sx={{ flex: 1, overflow: "auto", px: 2, py: 1 }}>
                  {items.map((item, index) => (
                    <Slide
                      key={item._id}
                      direction="left"
                      in
                      timeout={300 + index * 100}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          background: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={
                                typeof getProductImage(item) === "string" &&
                                getProductImage(item).startsWith("http")
                                  ? getProductImage(item)
                                  : undefined
                              }
                              sx={{
                                bgcolor: "primary.light",
                                width: 50,
                                height: 50,
                              }}
                            >
                              {typeof getProductImage(item) === "string" &&
                              !getProductImage(item).startsWith("http")
                                ? getProductImage(item)
                                : item.name[0]}
                            </Avatar>
                          </ListItemAvatar>

                          <Box sx={{ flex: 1, ml: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(item.price)} x {item.quantity}
                            </Typography>
                            <Typography
                              variant="h6"
                              color="primary"
                              fontWeight="bold"
                            >
                              {formatCurrency(item.price * item.quantity)}
                            </Typography>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => removeItem(item._id)}
                            sx={{
                              color: "error.main",
                              "&:hover": {
                                bgcolor: "error.light",
                                color: "white",
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>

                        {/* Quantity Controls */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            bgcolor: "rgba(103, 126, 234, 0.1)",
                            borderRadius: 2,
                            p: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            sx={{
                              bgcolor: "white",
                              boxShadow: 1,
                              "&:hover": { bgcolor: "grey.100" },
                            }}
                          >
                            <Remove />
                          </IconButton>

                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 0;
                              handleQuantityChange(item._id, newQuantity);
                            }}
                            inputProps={{
                              style: {
                                textAlign: "center",
                                width: "60px",
                                fontWeight: "bold",
                              },
                              min: 1,
                            }}
                            type="number"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "white",
                                borderRadius: 2,
                              },
                            }}
                          />

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            sx={{
                              bgcolor: "white",
                              boxShadow: 1,
                              "&:hover": { bgcolor: "grey.100" },
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Slide>
                  ))}
                </List>

                {/* Total Section */}
                <Paper
                  elevation={3}
                  sx={{
                    m: 2,
                    p: 2,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6">
                      Tổng cộng ({getTotalItems()} sản phẩm):
                    </Typography>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="h5" fontWeight="bold">
                        {formatCurrency(getTotalPrice())}
                      </Typography>
                      {getTotalPrice() < 500000 && (
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          + 30.000đ phí ship
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Alert
                    severity="info"
                    sx={{
                      mt: 1,
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      "& .MuiAlert-icon": { color: "white" },
                    }}
                  >
                    {getTotalPrice() >= 500000
                      ? "🎉 Miễn phí vận chuyển! Giao hàng trong 2-3 ngày"
                      : "Phí vận chuyển: 30.000đ | Miễn phí cho đơn trên 500k"}
                  </Alert>
                </Paper>

                {/* Actions */}
                <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={clearCart}
                    sx={{
                      flex: 1,
                      borderColor: "error.main",
                      color: "error.main",
                      "&:hover": {
                        borderColor: "error.dark",
                        bgcolor: "error.light",
                        color: "white",
                      },
                    }}
                  >
                    Xóa tất cả
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      console.log("🔥 THANH TOÁN BUTTON CLICKED!");
                      console.log("Items:", items);
                      console.log("Total price:", getTotalPrice());
                      handleCheckout();
                    }}
                    startIcon={<Payment />}
                    sx={{
                      flex: 2,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      },
                    }}
                  >
                    Thanh toán
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Payment Processor */}
      {showPayment && (
        <ProductPaymentProcessor
          open={showPayment}
          onClose={() => {
            console.log("Closing payment processor");
            setShowPayment(false);
          }}
          cartItems={items}
          totalAmount={getTotalPrice()}
          onPaymentSuccess={() => {
            console.log("Payment success callback");
            handlePaymentSuccess();
          }}
        />
      )}

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn cần đăng nhập để thực hiện thanh toán. Vui lòng đăng nhập để
            tiếp tục.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowLoginDialog(false);
              onClose();
              window.location.href = "/login";
            }}
          >
            Đăng nhập
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartDrawer;
