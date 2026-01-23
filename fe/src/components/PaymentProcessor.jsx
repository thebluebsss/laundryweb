import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  QrCode,
  CheckCircle,
  Error,
  CreditCard,
  AccountBalance,
} from "@mui/icons-material";
import config from "../config/api";

const PaymentProcessor = ({
  open,
  onClose,
  paymentMethod,
  bookingData,
  orderData, // New prop for product orders
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [paymentStep, setPaymentStep] = useState("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Determine if this is a booking or order
  const isOrder = !!orderData;
  const paymentData = isOrder ? orderData : bookingData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getApiEndpoint = (method, action) => {
    const baseUrl = isOrder ? "/api/payment/products" : "/api/payment";

    switch (method) {
      case "vnpay":
        return `${baseUrl}/vnpay/${action}`;
      case "momo":
        return `${baseUrl}/momo/${action}`;
      case "payos":
        return `${baseUrl}/payos/${action}`;
      case "card":
        return `${baseUrl}/stripe/${action}`;
      default:
        return `${baseUrl}/${action}`;
    }
  };

  const handleVNPayPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${config.API_BASE_URL}${getApiEndpoint("vnpay", "create")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            [isOrder ? "orderId" : "bookingId"]: paymentData._id,
            amount: paymentData.totalAmount,
            orderInfo: isOrder
              ? `Thanh toán mua sản phẩm - ${paymentData._id}`
              : `Thanh toán dịch vụ giặt là - ${paymentData._id}`,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.message || "Không thể tạo thanh toán VNPay");
      }
    } catch (err) {
      setError(err.message);
      onPaymentError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoMoPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${config.API_BASE_URL}${getApiEndpoint("momo", "create")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            [isOrder ? "orderId" : "bookingId"]: paymentData._id,
            amount: paymentData.totalAmount,
            orderInfo: isOrder
              ? `Thanh toán mua sản phẩm - ${paymentData._id}`
              : `Thanh toán dịch vụ giặt là - ${paymentData._id}`,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        window.location.href = result.payUrl;
      } else {
        throw new Error(result.message || "Không thể tạo thanh toán MoMo");
      }
    } catch (err) {
      setError(err.message);
      onPaymentError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayOSPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const items = isOrder
        ? paymentData.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        : [
            {
              name: `Dịch vụ ${paymentData.service}`,
              quantity: 1,
              price: paymentData.totalAmount,
            },
          ];

      const response = await fetch(
        `${config.API_BASE_URL}${getApiEndpoint("payos", "create")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            [isOrder ? "orderId" : "bookingId"]: paymentData._id,
            amount: paymentData.totalAmount,
            orderInfo: isOrder
              ? `Thanh toán mua sản phẩm - ${paymentData._id}`
              : `Thanh toán dịch vụ giặt là - ${paymentData._id}`,
            items,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error(result.message || "Không thể tạo thanh toán PayOS");
      }
    } catch (err) {
      setError(err.message);
      onPaymentError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${config.API_BASE_URL}${getApiEndpoint("card", "create-intent")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: paymentData.totalAmount,
            currency: "vnd",
            [isOrder ? "orderId" : "bookingId"]: paymentData._id,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        // Here you would integrate with Stripe Elements
        // For now, we'll simulate success
        setTimeout(() => {
          setPaymentStep("success");
          onPaymentSuccess({
            transactionId: result.paymentIntentId,
            paymentMethod: "card",
            amount: paymentData.totalAmount,
          });
        }, 2000);
      } else {
        throw new Error(result.message || "Không thể tạo thanh toán thẻ");
      }
    } catch (err) {
      setError(err.message);
      onPaymentError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransferPayment = () => {
    setPaymentStep("bank_qr");
  };

  const handlePayment = () => {
    switch (paymentMethod) {
      case "vnpay":
        handleVNPayPayment();
        break;
      case "momo":
        handleMoMoPayment();
        break;
      case "payos":
        handlePayOSPayment();
        break;
      case "card":
        handleCardPayment();
        break;
      case "bank_transfer":
        handleBankTransferPayment();
        break;
      default:
        setError("Phương thức thanh toán không được hỗ trợ");
    }
  };

  const renderPaymentForm = () => {
    const getPaymentIcon = () => {
      switch (paymentMethod) {
        case "vnpay":
          return (
            <AccountBalance sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
          );
        case "momo":
          return (
            <AccountBalance sx={{ fontSize: 60, color: "#d32f2f", mb: 2 }} />
          );
        case "payos":
          return <QrCode sx={{ fontSize: 60, color: "#2196F3", mb: 2 }} />;
        case "card":
          return <CreditCard sx={{ fontSize: 60, color: "#4caf50", mb: 2 }} />;
        case "bank_transfer":
          return <QrCode sx={{ fontSize: 60, color: "#2196F3", mb: 2 }} />;
        default:
          return <QrCode sx={{ fontSize: 60, color: "#2196F3", mb: 2 }} />;
      }
    };

    const getPaymentTitle = () => {
      switch (paymentMethod) {
        case "vnpay":
          return "Thanh toán VNPay";
        case "momo":
          return "Thanh toán MoMo";
        case "payos":
          return "Thanh toán PayOS";
        case "card":
          return "Thanh toán thẻ tín dụng";
        case "bank_transfer":
          return "Chuyển khoản ngân hàng";
        default:
          return "Thanh toán";
      }
    };

    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        {getPaymentIcon()}
        <Typography variant="h6" gutterBottom>
          {getPaymentTitle()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {isOrder
            ? "Thanh toán đơn hàng sản phẩm"
            : "Thanh toán dịch vụ giặt là"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Mã {isOrder ? "đơn hàng" : "booking"}:</strong>{" "}
            {paymentData._id}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Tổng tiền:</strong>{" "}
            {formatCurrency(paymentData.totalAmount)}
          </Typography>
          {isOrder && (
            <Typography variant="body2" gutterBottom>
              <strong>Số sản phẩm:</strong> {paymentData.items?.length || 0} sản
              phẩm
            </Typography>
          )}
          {!isOrder && (
            <Typography variant="body2" gutterBottom>
              <strong>Dịch vụ:</strong> {paymentData.service}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const renderBankQR = () => {
    const bankInfo = {
      bankId: "970422",
      accountNo: "0969263238",
      accountName: "HOANG THANH LONG",
      amount: paymentData.totalAmount,
      description: (isOrder ? "MUASAM " : "GIATLA ") + paymentData._id,
    };

    const qrUrl =
      "https://img.vietqr.io/image/" +
      bankInfo.bankId +
      "-" +
      bankInfo.accountNo +
      "-compact2.png?amount=" +
      bankInfo.amount +
      "&addInfo=" +
      encodeURIComponent(bankInfo.description) +
      "&accountName=" +
      encodeURIComponent(bankInfo.accountName);

    return (
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "center",
          }}
        >
          <QrCode sx={{ color: "#2196F3" }} /> Quét mã QR để thanh toán
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 3,
            p: 2,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={qrUrl}
            alt="QR Code thanh toán"
            style={{
              maxWidth: "300px",
              width: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Ngân hàng:</strong> MB Bank
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Số tài khoản:</strong> {bankInfo.accountNo}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Chủ tài khoản:</strong> {bankInfo.accountName}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Số tiền:</strong> {formatCurrency(paymentData.totalAmount)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Nội dung:</strong> {bankInfo.description}
          </Typography>
        </Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý
          nhanh chóng.
        </Alert>
        <Alert severity="warning">
          Sau khi chuyển khoản thành công, vui lòng chờ 1-2 phút để hệ thống xác
          nhận thanh toán.
        </Alert>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Thanh toán {isOrder ? "đơn hàng" : "dịch vụ"}
        <Typography variant="body2" color="text.secondary">
          Mã {isOrder ? "đơn hàng" : "booking"}: {paymentData?._id}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="primary">
            Tổng tiền: {formatCurrency(paymentData?.totalAmount || 0)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {paymentStep === "input" && renderPaymentForm()}
        {paymentStep === "bank_qr" && renderBankQR()}
        {paymentStep === "processing" && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Đang xử lý thanh toán...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng không đóng cửa sổ này
            </Typography>
          </Box>
        )}
        {paymentStep === "success" && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircle sx={{ fontSize: 60, color: "#4CAF50", mb: 2 }} />
            <Typography variant="h6" gutterBottom color="success.main">
              Thanh toán thành công!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isOrder ? "Đơn hàng" : "Booking"} của bạn đã được xác nhận
            </Typography>
          </Box>
        )}
        {paymentStep === "error" && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Error sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
            <Typography variant="h6" gutterBottom color="error">
              Thanh toán thất bại
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error || "Đã có lỗi xảy ra trong quá trình thanh toán"}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {paymentStep === "input" && (
          <>
            <Button onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handlePayment}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </Button>
          </>
        )}
        {paymentStep === "bank_qr" && (
          <>
            <Button onClick={() => setPaymentStep("input")}>Quay lại</Button>
            <Button
              variant="contained"
              onClick={() => {
                setPaymentStep("success");
                onPaymentSuccess({
                  transactionId: "BANK_" + Date.now(),
                  paymentMethod: "bank_transfer",
                  amount: paymentData.totalAmount,
                });
              }}
            >
              Đã chuyển khoản
            </Button>
          </>
        )}
        {(paymentStep === "success" || paymentStep === "error") && (
          <Button variant="contained" onClick={onClose}>
            Đóng
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentProcessor;
