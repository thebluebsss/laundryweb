"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
  FormGroup,
  Alert,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import "dayjs/locale/vi";

const API_BASE_URL = "http://localhost:3001/api";

export default function BookingForm({ onSuccess }) {
  // Thông tin người dùng từ localStorage
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Form booking
  const [service, setService] = useState("giat-say");
  const [pickupDate, setPickupDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [detergent, setDetergent] = useState("Omo");
  const [bleach, setBleach] = useState("Sử dụng");
  const [useBag, setUseBag] = useState("Có");
  const [dryCleaningItems, setDryCleaningItems] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    try {
      // Lấy thông tin từ localStorage (đã lưu khi đăng nhập)
      const userName = localStorage.getItem("userName");
      const userPhone = localStorage.getItem("userPhone");
      const userAddress = localStorage.getItem("userAddress");
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Vui lòng đăng nhập để đặt lịch");
        setLoading(false);
        return;
      }

      // Nếu có thông tin trong localStorage, sử dụng luôn
      if (userName) {
        setUserInfo({
          name: userName,
          phone: userPhone || "",
          address: userAddress || "",
        });
        setLoading(false);
        return;
      }

      // Nếu không có, thử gọi API
      loadFromAPI();
    } catch (error) {
      console.error("Lỗi tải thông tin:", error);
      setLoading(false);
    }
  };

  const loadFromAPI = async () => {
    try {
      const token = localStorage.getItem("token");

      // Sử dụng endpoint /auth/profile thay vì /users/:id
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const userData = {
          name: data.data.fullName || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
        };

        setUserInfo(userData);

        // Lưu lại vào localStorage cho lần sau
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userPhone", userData.phone);
        localStorage.setItem("userAddress", userData.address);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const bookingData = {
      name: userInfo.name,
      phone: userInfo.phone,
      address: userInfo.address,
      service,
      pickupDate,
      deliveryDate,
      detergent,
      bleach,
      useBag,
      dryCleaningItems,
      notes,
      paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Lỗi");

      if (onSuccess) {
        onSuccess({
          booking: data.data,
          recommendedProducts: data.recommendedProducts || [],
          paymentUrl: data.paymentUrl || null,
        });
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography align="center">Đang tải thông tin...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: "700px",
          margin: "2rem auto",
          padding: "2rem",
          boxShadow: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          🧺 Đặt Lịch Giặt Là
        </Typography>

        {message && (
          <Alert
            severity={message.includes("Lỗi") ? "error" : "success"}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        {/* Thông tin khách hàng - Chỉ hiển thị, không cho sửa */}
        <Paper elevation={1} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PersonIcon /> Thông tin khách hàng
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon fontSize="small" color="action" />
              <Typography>
                <strong>Họ tên:</strong> {userInfo.name || "Chưa cập nhật"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography>
                <strong>Số điện thoại:</strong>{" "}
                {userInfo.phone || "Chưa cập nhật"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HomeIcon fontSize="small" color="action" />
              <Typography>
                <strong>Địa chỉ:</strong> {userInfo.address || "Chưa cập nhật"}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            💡 Để thay đổi thông tin này, vui lòng cập nhật trong tài khoản của
            bạn
          </Typography>
        </Paper>

        {/* Form đặt lịch */}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Chi tiết đặt lịch
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Dịch vụ *</InputLabel>
          <Select
            value={service}
            label="Dịch vụ *"
            onChange={(e) => setService(e.target.value)}
            required
          >
            <MenuItem value="giat-say">Giặt Sấy</MenuItem>
            <MenuItem value="giat-kho">Giặt Khô</MenuItem>
            <MenuItem value="giat-ui">Giặt Ủi</MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          label="Ngày lấy đồ *"
          value={pickupDate}
          onChange={(newValue) => setPickupDate(newValue)}
          slotProps={{
            textField: {
              required: true,
              fullWidth: true,
            },
          }}
        />

        <DatePicker
          label="Ngày trả đồ (Ngày bắt đầu) *"
          value={deliveryDate}
          onChange={(newValue) => setDeliveryDate(newValue)}
          slotProps={{
            textField: {
              required: true,
              fullWidth: true,
            },
          }}
        />

        <FormControl>
          <FormLabel>Loại bột (nước) giặt</FormLabel>
          <RadioGroup
            row
            value={detergent}
            onChange={(e) => setDetergent(e.target.value)}
          >
            <FormControlLabel value="Omo" control={<Radio />} label="Omo" />
            <FormControlLabel value="Gain" control={<Radio />} label="Gain" />
            <FormControlLabel
              value="Bột giặt của tôi"
              control={<Radio />}
              label="Bột giặt của tôi"
            />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Chất tẩy trắng</FormLabel>
          <RadioGroup
            row
            value={bleach}
            onChange={(e) => setBleach(e.target.value)}
          >
            <FormControlLabel
              value="Sử dụng"
              control={<Radio />}
              label="Sử dụng"
            />
            <FormControlLabel
              value="Không sử dụng"
              control={<Radio />}
              label="Không sử dụng"
            />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Sử dụng túi giặt?</FormLabel>
          <RadioGroup
            row
            value={useBag}
            onChange={(e) => setUseBag(e.target.value)}
          >
            <FormControlLabel value="Có" control={<Radio />} label="Có" />
            <FormControlLabel value="Không" control={<Radio />} label="Không" />
          </RadioGroup>
        </FormControl>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={dryCleaningItems}
                onChange={(e) => setDryCleaningItems(e.target.checked)}
              />
            }
            label="Đồ giặt khô (Tối đa 5 loại)"
          />
        </FormGroup>

        <TextField
          label="Lưu ý của bạn (Ghi chú)"
          variant="outlined"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={4}
          placeholder="Ví dụ: Hãy giặt đồ của tôi bằng nước ấm, không dùng chất tẩy cho áo màu đỏ..."
        />

        <FormControl>
          <FormLabel>Phương thức thanh toán</FormLabel>
          <RadioGroup
            row
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="cod"
              control={<Radio />}
              label="💵 Thanh toán khi nhận hàng"
            />
            <FormControlLabel
              value="online"
              control={<Radio />}
              label="💳 Thanh toán Online"
            />
          </RadioGroup>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": { backgroundColor: "#45a049" },
            padding: "14px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {isSubmitting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Đang xử lý...
            </Box>
          ) : (
            "🚀 ĐẶT LỊCH NGAY"
          )}
        </Button>

        <Typography variant="caption" color="text.secondary" align="center">
          * Các trường bắt buộc phải điền
        </Typography>
      </Box>
    </LocalizationProvider>
  );
}
