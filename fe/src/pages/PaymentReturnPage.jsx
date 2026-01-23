import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { CheckCircle, Error, Payment, Receipt } from "@mui/icons-material";
import config from "../config/api";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("processing"); // processing, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    processPaymentReturn();
  }, []);

  const processPaymentReturn = async () => {
    try {
      const paymentMethod = searchParams.get("method") || "vnpay";
      const orderId =
        searchParams.get("vnp_TxnRef") || searchParams.get("orderId");
      const responseCode =
        searchParams.get("vnp_ResponseCode") || searchParams.get("resultCode");

      if (!orderId) {
        setError("Không tìm thấy thông tin đơn hàng");
        setPaymentStatus("failed");
        return;
      }

      // Get booking/order data - try both endpoints
      let dataResponse;
      let isOrder = false;

      try {
        // Try order first (product orders)
        dataResponse = await fetch(`${config.API_BASE_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (dataResponse.ok) {
          isOrder = true;
        } else {
          // If order not found, try booking (service orders)
          dataResponse = await fetch(
            `${config.API_BASE_URL}/bookings/${orderId}`,
          );
        }
      } catch (err) {
        // If order fails, try booking
        dataResponse = await fetch(
          `${config.API_BASE_URL}/bookings/${orderId}`,
        );
      }

      const dataResult = await dataResponse.json();

      if (dataResult.success) {
        setBookingData({ ...dataResult.data, isOrder });
      }

      // Get payment status from appropriate endpoint
      const paymentEndpoint = isOrder
        ? `${config.API_BASE_URL}/payment/products/status/${orderId}`
        : `${config.API_BASE_URL}/payment/status/${orderId}`;

      const paymentResponse = await fetch(paymentEndpoint);
      const paymentResult = await paymentResponse.json();

      if (paymentResult.success) {
        setPaymentData(paymentResult);

        // Determine payment status based on response codes
        if (paymentMethod === "vnpay") {
          setPaymentStatus(responseCode === "00" ? "success" : "failed");
        } else if (paymentMethod === "momo") {
          setPaymentStatus(responseCode === "0" ? "success" : "failed");
        } else {
          setPaymentStatus(
            paymentResult.paymentStatus === "paid" ? "success" : "failed",
          );
        }
      } else {
        setError("Không thể lấy thông tin thanh toán");
        setPaymentStatus("failed");
      }
    } catch (err) {
      console.error("Payment return error:", err);
      setError("Lỗi khi xử lý kết quả thanh toán");
      setPaymentStatus("failed");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      vnpay: "VNPay",
      momo: "MoMo",
      card: "Thẻ tín dụng/ghi nợ",
      bank_transfer: "Chuyển khoản ngân hàng",
    };
    return methods[method] || method;
  };

  const renderProcessing = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Đang xử lý kết quả thanh toán...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Vui lòng đợi trong giây lát
      </Typography>
    </Box>
  );

  const renderSuccess = () => (
    <Box>
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CheckCircle sx={{ fontSize: 80, color: "#4CAF50", mb: 2 }} />
        <Typography variant="h4" gutterBottom color="success.main">
          Thanh toán thành công!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
        </Typography>
      </Box>

      {bookingData && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Receipt /> Thông tin đơn hàng
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2">
                <strong>Mã đơn hàng:</strong> {bookingData._id}
              </Typography>

              {bookingData.isOrder ||
              bookingData.orderType === "product_purchase" ? (
                <>
                  <Typography variant="body2">
                    <strong>Loại:</strong> Đơn hàng sản phẩm
                  </Typography>
                  <Typography variant="body2">
                    <strong>Số lượng sản phẩm:</strong>{" "}
                    {bookingData.totalItems || bookingData.items?.length || 0}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Khách hàng:</strong>{" "}
                    {bookingData.customerInfo?.name || bookingData.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Số điện thoại:</strong>{" "}
                    {bookingData.customerInfo?.phone || bookingData.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Địa chỉ:</strong>{" "}
                    {bookingData.customerInfo?.address || bookingData.address}
                  </Typography>
                  {bookingData.shippingFee > 0 && (
                    <Typography variant="body2">
                      <strong>Phí vận chuyển:</strong>{" "}
                      {formatCurrency(bookingData.shippingFee)}
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body2">
                    <strong>Dịch vụ:</strong> {bookingData.service}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Khách hàng:</strong> {bookingData.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Số điện thoại:</strong> {bookingData.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Địa chỉ:</strong> {bookingData.address}
                  </Typography>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {paymentData && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Payment /> Thông tin thanh toán
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2">
                <strong>Phương thức:</strong>{" "}
                {getPaymentMethodName(paymentData.paymentMethod)}
              </Typography>
              <Typography variant="body2">
                <strong>Số tiền:</strong>{" "}
                {formatCurrency(paymentData.totalAmount)}
              </Typography>
              <Typography variant="body2">
                <strong>Trạng thái:</strong>
                <span
                  style={{
                    color: "#4CAF50",
                    fontWeight: "bold",
                    marginLeft: "8px",
                  }}
                >
                  Đã thanh toán
                </span>
              </Typography>
              {paymentData.paymentDetails?.transactionId && (
                <Typography variant="body2">
                  <strong>Mã giao dịch:</strong>{" "}
                  {paymentData.paymentDetails.transactionId}
                </Typography>
              )}
              {paymentData.paymentDetails?.paidAt && (
                <Typography variant="body2">
                  <strong>Thời gian:</strong>{" "}
                  {new Date(paymentData.paymentDetails.paidAt).toLocaleString(
                    "vi-VN",
                  )}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderFailed = () => (
    <Box>
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Error sx={{ fontSize: 80, color: "#f44336", mb: 2 }} />
        <Typography variant="h4" gutterBottom color="error">
          Thanh toán thất bại
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Đã có lỗi xảy ra trong quá trình thanh toán
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {bookingData && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông tin đơn hàng
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Mã đơn hàng:</strong> {bookingData._id}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Trạng thái:</strong>
              <span
                style={{
                  color: "#ff9800",
                  fontWeight: "bold",
                  marginLeft: "8px",
                }}
              >
                Chờ thanh toán
              </span>
            </Typography>

            <Alert severity="info" sx={{ mt: 2 }}>
              Đơn hàng của bạn vẫn được giữ. Bạn có thể thử thanh toán lại hoặc
              chọn phương thức thanh toán khác.
            </Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2rem",
      }}
    >
      <Card>
        <CardContent sx={{ p: 4 }}>
          {paymentStatus === "processing" && renderProcessing()}
          {paymentStatus === "success" && renderSuccess()}
          {paymentStatus === "failed" && renderFailed()}

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}
          >
            <Button variant="outlined" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>

            {paymentStatus === "success" && (
              <Button variant="contained" onClick={() => navigate("/orders")}>
                Xem đơn hàng
              </Button>
            )}

            {paymentStatus === "failed" && bookingData && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate(`/payment/${bookingData._id}`)}
              >
                Thử thanh toán lại
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentReturnPage;
