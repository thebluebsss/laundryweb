import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ShoppingCart,
  Payment,
  CheckCircle,
  LocalShipping,
} from "@mui/icons-material";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PaymentProcessor from "./PaymentProcessor";
import config from "../config/api";

const ProductPaymentProcessor = ({
  open,
  onClose,
  cartItems,
  totalAmount,
  onPaymentSuccess,
}) => {
  if (!open) {
    return null;
  }

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderData, setOrderData] = useState(null);
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const steps = ["Xác nhận đơn hàng", "Chọn thanh toán", "Hoàn tất"];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getProductImage = (product) => {
    if (product.image) return product.image;

    const categoryIcons = {
      detergent: "🧴",
      softener: "💧",
      bleach: "🧪",
      bag: "👜",
      accessory: "🔧",
    };

    return categoryIcons[product.category] || "📦";
  };

  const calculateShipping = () => {
    return totalAmount >= 500000 ? 0 : 30000; // Free shipping over 500k
  };

  const getFinalTotal = () => {
    return totalAmount + calculateShipping();
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      await createOrder();
    }
  };

  const createOrder = async () => {
    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Bạn cần đăng nhập để thực hiện thanh toán");
      }

      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: getFinalTotal(),
        shippingFee: calculateShipping(),
        paymentMethod,
        orderType: "product_purchase",
      };

      const response = await fetch(`${config.API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        setOrderData(result.data);

        if (paymentMethod === "cod") {
          setActiveStep(2);
          setTimeout(() => {
            onPaymentSuccess();
          }, 2000);
        } else {
          setShowPaymentProcessor(true);
        }
      } else {
        throw new Error(result.message || "Không thể tạo đơn hàng");
      }
    } catch (err) {
      console.error("Create order error:", err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentProcessorSuccess = (paymentData) => {
    setShowPaymentProcessor(false);
    setActiveStep(2);
    setTimeout(() => {
      onPaymentSuccess();
    }, 2000);
  };

  const handlePaymentProcessorError = (error) => {
    setError(`Lỗi thanh toán: ${error}`);
    setShowPaymentProcessor(false);
  };

  const renderOrderSummary = () => {
    if (!cartItems || cartItems.length === 0) {
      return (
        <Box>
          <Typography>Không có sản phẩm nào trong giỏ hàng</Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <ShoppingCart /> Đơn hàng của bạn
        </Typography>

        <List>
          {cartItems.map((item) => (
            <ListItem key={item._id} sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar
                  src={
                    typeof getProductImage(item) === "string" &&
                    getProductImage(item).startsWith("http")
                      ? getProductImage(item)
                      : undefined
                  }
                  sx={{ bgcolor: "primary.light" }}
                >
                  {typeof getProductImage(item) === "string" &&
                  !getProductImage(item).startsWith("http")
                    ? getProductImage(item)
                    : item.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`${formatCurrency(item.price)} x ${item.quantity}`}
              />
              <Typography variant="body2" fontWeight="bold">
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Tạm tính:</Typography>
            <Typography>{formatCurrency(totalAmount)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Phí vận chuyển:</Typography>
            <Typography
              color={
                calculateShipping() === 0 ? "success.main" : "text.primary"
              }
            >
              {calculateShipping() === 0
                ? "Miễn phí"
                : formatCurrency(calculateShipping())}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Tổng cộng:</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatCurrency(getFinalTotal())}
            </Typography>
          </Box>
        </Box>

        {calculateShipping() === 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            🎉 Bạn được miễn phí vận chuyển!
          </Alert>
        )}
      </Box>
    );
  };

  const renderPaymentSelection = () => {
    return (
      <Box>
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
          totalAmount={getFinalTotal()}
        />

        <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <LocalShipping
              sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
            />
            Thời gian giao hàng: 2-3 ngày làm việc
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderSuccess = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <CheckCircle sx={{ fontSize: 80, color: "#4CAF50", mb: 2 }} />
      <Typography variant="h5" gutterBottom color="success.main">
        Đặt hàng thành công!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi
      </Typography>

      {orderData && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Mã đơn hàng:</strong> {orderData._id}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Tổng tiền:</strong> {formatCurrency(orderData.totalAmount)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Phương thức thanh toán:</strong>{" "}
            {paymentMethod === "cod"
              ? "Thanh toán khi nhận hàng"
              : paymentMethod === "vnpay"
                ? "VNPay"
                : paymentMethod === "momo"
                  ? "MoMo"
                  : paymentMethod === "card"
                    ? "Thẻ tín dụng"
                    : "Chuyển khoản ngân hàng"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Thời gian giao hàng dự kiến:</strong> 2-3 ngày làm việc
          </Typography>
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 2, textAlign: "left" }}>
        <Typography variant="body2">
          <strong>📱 Theo dõi đơn hàng:</strong>
          <br />
          • Bạn có thể xem trạng thái đơn hàng trong mục "Đơn hàng của tôi"
          <br />
          • Chúng tôi sẽ gửi thông báo khi đơn hàng được xử lý
          <br />• Liên hệ hotline nếu cần hỗ trợ: 1900-xxxx
        </Typography>
      </Alert>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderOrderSummary();
      case 1:
        return renderPaymentSelection();
      case 2:
        return renderSuccess();
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: "400px" },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Payment />
            Thanh toán đơn hàng
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {getStepContent(activeStep)}
        </DialogContent>

        <DialogActions>
          {activeStep < 2 && (
            <>
              <Button onClick={onClose} disabled={processing}>
                Hủy
              </Button>

              {activeStep > 0 && (
                <Button
                  onClick={() => setActiveStep(activeStep - 1)}
                  disabled={processing}
                >
                  Quay lại
                </Button>
              )}

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={processing}
                startIcon={processing && <CircularProgress size={20} />}
              >
                {processing
                  ? "Đang xử lý..."
                  : activeStep === 1
                    ? "Đặt hàng"
                    : "Tiếp tục"}
              </Button>
            </>
          )}

          {activeStep === 2 && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  onClose();
                  // Navigate to orders page if available
                  if (window.location.pathname !== "/orders") {
                    window.location.href = "/orders";
                  }
                }}
              >
                Xem đơn hàng
              </Button>
              <Button variant="contained" onClick={onClose}>
                Hoàn tất
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* Payment Processor for non-COD payments */}
      {showPaymentProcessor && orderData && (
        <PaymentProcessor
          open={showPaymentProcessor}
          onClose={() => setShowPaymentProcessor(false)}
          paymentMethod={paymentMethod}
          orderData={orderData} // Pass orderData instead of bookingData
          onPaymentSuccess={handlePaymentProcessorSuccess}
          onPaymentError={handlePaymentProcessorError}
        />
      )}
    </>
  );
};

export default ProductPaymentProcessor;
