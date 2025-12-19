import React from "react";
import ProductRecommendations from "../components/ProductRecommendations";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function BookingSuccessPage({ bookingData, onClose }) {
  const { booking, recommendedProducts } = bookingData;

  const formatDate = (date) => {
    if (!date) return "Chưa xác định";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const getServiceName = (service) => {
    const services = {
      "giat-say": "Giặt Sấy",
      "giat-kho": "Giặt Khô",
      "giat-ui": "Giặt Ủi",
    };
    return services[service] || service;
  };

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "2rem auto",
        padding: "2rem",
      }}
    >
      <Card
        sx={{
          marginBottom: "2rem",
          backgroundColor: "#f0f9ff",
          border: "2px solid #4CAF50",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 80, color: "#4CAF50" }} />
            <Typography variant="h4" component="h1" color="#4CAF50">
              Đặt Lịch Thành Công!
            </Typography>
            <Typography variant="body1" textAlign="center">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
              <br />
              Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ marginBottom: "2rem" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📋 Thông Tin Đơn Hàng
          </Typography>
          <Box sx={{ display: "grid", gap: 1, marginTop: 2 }}>
            <Typography>
              <strong>Mã đơn:</strong> {booking._id}
            </Typography>
            <Typography>
              <strong>Tên khách hàng:</strong> {booking.name}
            </Typography>
            <Typography>
              <strong>Số điện thoại:</strong> {booking.phone}
            </Typography>
            <Typography>
              <strong>Địa chỉ:</strong> {booking.address}
            </Typography>
            <Typography>
              <strong>Dịch vụ:</strong> {getServiceName(booking.service)}
            </Typography>
            <Typography>
              <strong>Ngày lấy đồ:</strong> {formatDate(booking.pickupDate)}
            </Typography>
            <Typography>
              <strong>Ngày trả đồ:</strong> {formatDate(booking.deliveryDate)}
            </Typography>
            <Typography>
              <strong>Bột giặt:</strong> {booking.detergent}
            </Typography>
            <Typography>
              <strong>Chất tẩy:</strong> {booking.bleach}
            </Typography>
            <Typography>
              <strong>Sử dụng túi giặt:</strong> {booking.useBag}
            </Typography>
            {booking.notes && (
              <Typography>
                <strong>Ghi chú:</strong> {booking.notes}
              </Typography>
            )}
            <Typography>
              <strong>Thanh toán:</strong>{" "}
              {booking.paymentMethod === "cod"
                ? "Thanh toán khi nhận hàng"
                : "Thanh toán Online"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {recommendedProducts && recommendedProducts.length > 0 && (
        <ProductRecommendations
          bookingId={booking._id}
          products={recommendedProducts}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          marginTop: "2rem",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ padding: "12px 32px" }}
        >
          Về Trang Chủ
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => (window.location.href = "/san-pham")}
          sx={{ padding: "12px 32px" }}
        >
          Gợi ý sản phẩm
        </Button>
      </Box>
    </Box>
  );
}

export default BookingSuccessPage;
