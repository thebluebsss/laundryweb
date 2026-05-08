"use client";
import { useState, useEffect } from "react";
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
  Slider,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import config from "../config/api";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PaymentProcessor from "./PaymentProcessor";

export default function BookingForm({ onSuccess }) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Form booking
  const [service, setService] = useState("giat-say-thuong");
  const [pickupDate, setPickupDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [detergent, setDetergent] = useState("Omo");
  const [bleach, setBleach] = useState("Sử dụng");
  const [useBag, setUseBag] = useState("Có");
  const [dryCleaningItems, setDryCleaningItems] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [estimatedWeight, setEstimatedWeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [service, dryCleaningItems, useBag, estimatedWeight]);

  const calculatePrice = () => {
    const servicePrices = {
      // Giặt theo kg
      "giat-say-thuong": 25000,
      "giat-kho-kg": 35000,
      "giat-ui-kg": 30000,

      // Combo packages
      "combo-gia-dinh": 100000,
      "combo-sinh-vien": 65000,
      "combo-van-phong": 45000,

      // Bộ đồ
      "bo-complet": 80000,
      "bo-ki-gia": 60000,
      "bo-vet-nu": 70000,
      "bo-vet-khong-lot": 55000,
      "bo-the-thao": 40000,
      "bo-ngu": 35000,
      "bo-quan-ao-gio": 35000,
      "bo-quan-ao-dai-nhung": 90000,
      "bo-quan-ao-dai-thuong": 80000,

      // Áo
      "ao-so-mi": 20000,
      "ao-vest": 45000,
      "ao-khoac": 35000,
      "ao-len": 25000,
      "ao-da": 50000,

      // Quần
      "quan-tay": 25000,
      "quan-jean": 20000,
      "quan-kaki": 18000,
      "quan-short": 15000,

      // Váy
      "vay-cong-so": 30000,
      "vay-da-hoi": 60000,
      "vay-jean": 25000,

      // Chăn gối
      "chan-don": 40000,
      "chan-doi": 60000,
      goi: 15000,
      nem: 80000,

      // Đồ đặc biệt
      "ao-cuoi": 150000,
      "vay-cuoi": 200000,
      "do-da": 100000,
      "do-long-thu": 120000,
    };

    // Dịch vụ tính theo kg
    const perKgServices = ["giat-say-thuong", "giat-kho-kg", "giat-ui-kg"];

    let basePrice = servicePrices[service] || 0;
    if (perKgServices.includes(service)) {
      basePrice = basePrice * estimatedWeight;
    }

    let additionalFee = 0;

    if (dryCleaningItems) {
      additionalFee += 15000; // Phí đồ giặt khô thêm
    }

    if (useBag === "Có") {
      additionalFee += 5000; // Phí túi giặt
    }

    const total = basePrice + additionalFee;
    setTotalAmount(total);
  };

  const loadUserInfo = () => {
    try {
      const userName = localStorage.getItem("userName");
      const userPhone = localStorage.getItem("userPhone");
      const userAddress = localStorage.getItem("userAddress");
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Vui lòng đăng nhập để đặt lịch");
        setLoading(false);
        return;
      }

      if (userName) {
        setUserInfo({
          name: userName,
          phone: userPhone || "",
          address: userAddress || "",
        });
        setLoading(false);
        return;
      }

      loadFromAPI();
    } catch (error) {
      console.error("Lỗi tải thông tin:", error);
      setLoading(false);
    }
  };

  const loadFromAPI = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.API_BASE_URL}/auth/profile`, {
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
      estimatedWeight: [
        "giat-say-thuong",
        "giat-kho-kg",
        "giat-ui-kg",
      ].includes(service)
        ? estimatedWeight
        : null,
    };

    try {
      const response = await fetch(`${config.API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Lỗi");

      setCurrentBooking(data.data);
      if (paymentMethod === "cod") {
        if (onSuccess) {
          onSuccess({
            booking: data.data,
            recommendedProducts: data.recommendedProducts || [],
          });
        }
      } else {
        setShowPaymentProcessor(true);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentProcessor(false);
    if (onSuccess) {
      onSuccess({
        booking: currentBooking,
        recommendedProducts: [],
        paymentData,
      });
    }
  };

  const handlePaymentError = (error) => {
    setMessage(`Lỗi thanh toán: ${error}`);
    setShowPaymentProcessor(false);
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
          maxWidth: "800px",
          margin: "3rem auto",
          padding: { xs: "2rem", md: "3rem" },
          borderRadius: 5,
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Đặt Lịch Giặt Là
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
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            border: "1px solid rgba(103, 126, 234, 0.1)",
          }}
        >
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
            {/* Giặt ướt sấy khô */}
            <MenuItem value="giat-say-thuong" data-price="25000">
              Giặt sấy thường (25.000đ/kg)
            </MenuItem>
            <MenuItem value="giat-kho-kg" data-price="35000">
              Giặt khô (35.000đ/kg)
            </MenuItem>
            <MenuItem value="giat-ui-kg" data-price="30000">
              Giặt ủi (30.000đ/kg)
            </MenuItem>

            {/* Combo packages */}
            <MenuItem value="combo-gia-dinh" data-price="100000">
              Combo gia đình 5kg (100.000đ)
            </MenuItem>
            <MenuItem value="combo-sinh-vien" data-price="65000">
              Combo sinh viên 3kg (65.000đ)
            </MenuItem>
            <MenuItem value="combo-van-phong" data-price="45000">
              Combo văn phòng 2kg (45.000đ)
            </MenuItem>

            {/* Giặt khô từng món - Bộ đồ */}
            <MenuItem value="bo-complet" data-price="80000">
              Bộ Complete (80.000đ)
            </MenuItem>
            <MenuItem value="bo-ki-gia" data-price="60000">
              Bộ kí giả (60.000đ)
            </MenuItem>
            <MenuItem value="bo-vet-nu" data-price="70000">
              Bộ vét nữ (70.000đ)
            </MenuItem>
            <MenuItem value="bo-vet-khong-lot" data-price="55000">
              Bộ vét không lót (55.000đ)
            </MenuItem>
            <MenuItem value="bo-the-thao" data-price="40000">
              Bộ đồ thể thao (40.000đ)
            </MenuItem>
            <MenuItem value="bo-ngu" data-price="35000">
              Bộ đồ ngủ (35.000đ)
            </MenuItem>
            <MenuItem value="bo-quan-ao-gio" data-price="35000">
              Bộ quần áo gió mỏng (35.000đ)
            </MenuItem>
            <MenuItem value="bo-quan-ao-dai-nhung" data-price="90000">
              Bộ quần áo dài nhung (90.000đ)
            </MenuItem>
            <MenuItem value="bo-quan-ao-dai-thuong" data-price="80000">
              Bộ quần áo dài thường (80.000đ)
            </MenuItem>

            {/* Áo */}
            <MenuItem value="ao-so-mi" data-price="20000">
              Áo sơ mi (20.000đ)
            </MenuItem>
            <MenuItem value="ao-vest" data-price="45000">
              Áo vest (45.000đ)
            </MenuItem>
            <MenuItem value="ao-khoac" data-price="35000">
              Áo khoác (35.000đ)
            </MenuItem>
            <MenuItem value="ao-len" data-price="25000">
              Áo len (25.000đ)
            </MenuItem>
            <MenuItem value="ao-da" data-price="50000">
              Áo dạ (50.000đ)
            </MenuItem>

            {/* Quần */}
            <MenuItem value="quan-tay" data-price="25000">
              Quần tây (25.000đ)
            </MenuItem>
            <MenuItem value="quan-jean" data-price="20000">
              Quần jean (20.000đ)
            </MenuItem>
            <MenuItem value="quan-kaki" data-price="18000">
              Quần kaki (18.000đ)
            </MenuItem>
            <MenuItem value="quan-short" data-price="15000">
              Quần short (15.000đ)
            </MenuItem>

            {/* Váy */}
            <MenuItem value="vay-cong-so" data-price="30000">
              Váy công sở (30.000đ)
            </MenuItem>
            <MenuItem value="vay-da-hoi" data-price="60000">
              Váy dạ hội (60.000đ)
            </MenuItem>
            <MenuItem value="vay-jean" data-price="25000">
              Váy jean (25.000đ)
            </MenuItem>

            {/* Chăn gối */}
            <MenuItem value="chan-don" data-price="40000">
              Chăn đơn (40.000đ)
            </MenuItem>
            <MenuItem value="chan-doi" data-price="60000">
              Chăn đôi (60.000đ)
            </MenuItem>
            <MenuItem value="goi" data-price="15000">
              Gối (15.000đ)
            </MenuItem>
            <MenuItem value="nem" data-price="80000">
              Nệm (80.000đ)
            </MenuItem>

            {/* Đồ đặc biệt */}
            <MenuItem value="ao-cuoi" data-price="150000">
              Áo cưới (150.000đ)
            </MenuItem>
            <MenuItem value="vay-cuoi" data-price="200000">
              Váy cưới (200.000đ)
            </MenuItem>
            <MenuItem value="do-da" data-price="100000">
              Đồ da (100.000đ)
            </MenuItem>
            <MenuItem value="do-long-thu" data-price="120000">
              Đồ lông thú (120.000đ)
            </MenuItem>
          </Select>
        </FormControl>

        {["giat-say-thuong", "giat-kho-kg", "giat-ui-kg"].includes(service) && (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
              border: "2px solid #FF9800",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#E65100",
                fontWeight: "bold",
              }}
            >
              Ước tính khối lượng
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Khối lượng ước tính: <strong>{estimatedWeight} kg</strong>
              </Typography>

              <Box sx={{ px: 2, mt: 2 }}>
                <Slider
                  value={estimatedWeight}
                  onChange={(e, newValue) => setEstimatedWeight(newValue)}
                  min={1}
                  max={20}
                  step={0.5}
                  marks={[
                    { value: 1, label: "1kg" },
                    { value: 5, label: "5kg" },
                    { value: 10, label: "10kg" },
                    { value: 15, label: "15kg" },
                    { value: 20, label: "20kg" },
                  ]}
                  valueLabelDisplay="auto"
                  sx={{
                    color: "#FF9800",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#FF9800",
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "#FF9800",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "#FFE0B2",
                    },
                  }}
                />
              </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong> Hướng dẫn ước tính:</strong>
              </Typography>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                <li>
                  <strong>1-2kg:</strong> 3-4 áo sơ mi hoặc 1-2 bộ đồ thường
                </li>
                <li>
                  <strong>3-4kg:</strong> 1 tuần đồ của 1 người (áo, quần, đồ
                  lót)
                </li>
                <li>
                  <strong>5-7kg:</strong> 1 tuần đồ của 2 người hoặc đồ gia đình
                  nhỏ
                </li>
                <li>
                  <strong>8-12kg:</strong> Đồ gia đình lớn, chăn ga gối đệm
                </li>
                <li>
                  <strong>15kg+:</strong> Đồ giặt số lượng lớn, chăn đệm dày
                </li>
              </ul>
            </Alert>

            <Alert severity="warning">
              ....Khối lượng thực tế sẽ được cân chính xác khi lấy đồ. Giá cuối
              cùng có thể thay đổi....
            </Alert>
          </Paper>
        )}

        <DatePicker
          label="Ngày lấy đồ"
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
          label="Ngày trả đồ (Ngày bắt đầu)"
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

        {/* Price Display Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)",
            border: "2px solid #4CAF50",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#2E7D32",
              fontWeight: "bold",
            }}
          >
            💰 Chi tiết thanh toán
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>Dịch vụ đã chọn:</Typography>
              <Typography fontWeight="bold">
                {service === "giat-say-thuong" && "Giặt sấy thường"}
                {service === "giat-kho-kg" && "Giặt khô"}
                {service === "giat-ui-kg" && "Giặt ủi"}
                {service === "combo-gia-dinh" && "Combo gia đình 5kg"}
                {service === "combo-sinh-vien" && "Combo sinh viên 3kg"}
                {service === "combo-van-phong" && "Combo văn phòng 2kg"}
                {service === "bo-complet" && "Bộ Complete"}
                {service === "bo-ki-gia" && "Bộ kí giả"}
                {service === "bo-vet-nu" && "Bộ vét nữ"}
                {service === "bo-vet-khong-lot" && "Bộ vét không lót"}
                {service === "bo-the-thao" && "Bộ đồ thể thao"}
                {service === "bo-ngu" && "Bộ đồ ngủ"}
                {service === "bo-quan-ao-gio" && "Bộ quần áo gió mỏng"}
                {service === "bo-quan-ao-dai-nhung" && "Bộ quần áo dài nhung"}
                {service === "bo-quan-ao-dai-thuong" && "Bộ quần áo dài thường"}
                {service === "ao-so-mi" && "Áo sơ mi"}
                {service === "ao-vest" && "Áo vest"}
                {service === "ao-khoac" && "Áo khoác"}
                {service === "ao-len" && "Áo len"}
                {service === "ao-da" && "Áo dạ"}
                {service === "quan-tay" && "Quần tây"}
                {service === "quan-jean" && "Quần jean"}
                {service === "quan-kaki" && "Quần kaki"}
                {service === "quan-short" && "Quần short"}
                {service === "vay-cong-so" && "Váy công sở"}
                {service === "vay-da-hoi" && "Váy dạ hội"}
                {service === "vay-jean" && "Váy jean"}
                {service === "chan-don" && "Chăn đơn"}
                {service === "chan-doi" && "Chăn đôi"}
                {service === "goi" && "Gối"}
                {service === "nem" && "Nệm"}
                {service === "ao-cuoi" && "Áo cưới"}
                {service === "vay-cuoi" && "Váy cưới"}
                {service === "do-da" && "Đồ da"}
                {service === "do-long-thu" && "Đồ lông thú"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>Giá cơ bản:</Typography>
              <Typography>
                {["giat-say-thuong", "giat-kho-kg", "giat-ui-kg"].includes(
                  service,
                ) ? (
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      (totalAmount -
                        (dryCleaningItems ? 15000 : 0) -
                        (useBag === "Có" ? 5000 : 0)) /
                        estimatedWeight,
                    )}
                    × {estimatedWeight}kg ={" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      totalAmount -
                        (dryCleaningItems ? 15000 : 0) -
                        (useBag === "Có" ? 5000 : 0),
                    )}
                  </span>
                ) : (
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    totalAmount -
                      (dryCleaningItems ? 15000 : 0) -
                      (useBag === "Có" ? 5000 : 0),
                  )
                )}
              </Typography>
            </Box>

            {dryCleaningItems && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography color="text.secondary">
                  + Đồ giặt khô thêm:
                </Typography>
                <Typography color="text.secondary">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(15000)}
                </Typography>
              </Box>
            )}

            {useBag === "Có" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography color="text.secondary">+ Túi giặt:</Typography>
                <Typography color="text.secondary">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(5000)}
                </Typography>
              </Box>
            )}

            <Divider />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="#2E7D32">
                Tổng cộng:
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="#2E7D32">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalAmount)}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block", fontStyle: "italic" }}
          >
            💡 Giá có thể thay đổi tùy theo chất liệu và độ bẩn thực tế
          </Typography>
        </Paper>

        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
          totalAmount={totalAmount}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "translateY(-2px)",
            },
            padding: "16px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: 3,
            boxShadow: "0 8px 25px rgba(103, 126, 234, 0.3)",
            transition: "all 0.3s ease",
          }}
        >
          {isSubmitting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Đang xử lý...
            </Box>
          ) : (
            "ĐẶT LỊCH NGAY"
          )}
        </Button>

        <Typography variant="caption" color="text.secondary" align="center">
          * Các trường bắt buộc phải điền
        </Typography>
      </Box>

      {/* Payment Processor Dialog */}
      {showPaymentProcessor && currentBooking && (
        <PaymentProcessor
          open={showPaymentProcessor}
          onClose={() => setShowPaymentProcessor(false)}
          paymentMethod={paymentMethod}
          bookingData={currentBooking}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </LocalizationProvider>
  );
}
