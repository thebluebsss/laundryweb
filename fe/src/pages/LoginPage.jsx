import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockResetIcon from "@mui/icons-material/LockReset";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";

const API_BASE_URL = "http://localhost:3001/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Forgot Password States
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [otpMethod, setOtpMethod] = useState("email");
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    phone: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (token && userRole) {
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userName", data.user.fullName);
        localStorage.setItem("userPhone", data.user.phone);
        localStorage.setItem("userAddress", data.user.address || "");

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (registerData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName,
          phone: registerData.phone,
          address: registerData.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng...");

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userName", data.user.fullName);
        localStorage.setItem("userPhone", data.user.phone);
        localStorage.setItem("userAddress", data.user.address || "");

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setForgotPasswordStep(0);
    setOtpMethod("email");
    setForgotPasswordData({
      email: "",
      phone: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordStep(0);
    setOtpMethod("email");
    setError("");
    setSuccess("");
  };

  const handleRequestOTP = async () => {
    setError("");
    setSuccess("");

    // Kiểm tra theo phương thức được chọn
    if (otpMethod === "email") {
      if (!forgotPasswordData.email) {
        setError("Vui lòng nhập email");
        return;
      }
    } else {
      if (!forgotPasswordData.phone) {
        setError("Vui lòng nhập số điện thoại");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: otpMethod === "email" ? forgotPasswordData.email : "",
          phone: otpMethod === "phone" ? forgotPasswordData.phone : "",
          method: otpMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const methodText = otpMethod === "email" ? "email" : "số điện thoại";
        const destination =
          otpMethod === "email"
            ? forgotPasswordData.email
            : forgotPasswordData.phone;
        setForgotPasswordStep(1);
      } else {
        setError(data.message || "Không tìm thấy tài khoản với thông tin này");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!forgotPasswordData.otp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    if (!forgotPasswordData.newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: otpMethod === "email" ? forgotPasswordData.email : "",
          phone: otpMethod === "phone" ? forgotPasswordData.phone : "",
          otp: forgotPasswordData.otp,
          newPassword: forgotPasswordData.newPassword,
          method: otpMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        setTimeout(() => {
          handleForgotPasswordClose();
        }, 2000);
      } else {
        setError(data.message || "Mã OTP không hợp lệ hoặc đã hết hạn");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            🧺 Hệ Thống Giặt Là
          </Typography>

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => {
              setTabValue(newValue);
              setError("");
              setSuccess("");
            }}
            centered
            sx={{ marginBottom: 3 }}
          >
            <Tab icon={<PersonIcon />} label="Đăng nhập" />
            <Tab icon={<PersonAddIcon />} label="Đăng ký" />
            <Tab icon={<AdminPanelSettingsIcon />} label="Admin" />
          </Tabs>

          {error && (
            <Alert
              severity="error"
              sx={{ marginBottom: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {success}
            </Alert>
          )}

          {tabValue === 0 && (
            <Box
              component="form"
              onSubmit={handleUserLogin}
              sx={{ padding: 2 }}
            >
              <PersonIcon
                sx={{
                  fontSize: 80,
                  color: "#4caf50",
                  mb: 2,
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <Typography variant="h6" align="center" gutterBottom>
                Đăng nhập tài khoản
              </Typography>

              <TextField
                label="Tên đăng nhập"
                fullWidth
                margin="normal"
                required
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                disabled={loading}
              />

              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                disabled={loading}
              />

              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={handleForgotPasswordOpen}
                  sx={{ cursor: "pointer", textDecoration: "none" }}
                >
                  Quên mật khẩu?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  marginTop: 2,
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#45a049" },
                  padding: "12px",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
              </Button>
            </Box>
          )}

          {tabValue === 1 && (
            <Box component="form" onSubmit={handleRegister} sx={{ padding: 2 }}>
              <PersonAddIcon
                sx={{
                  fontSize: 80,
                  color: "#2196f3",
                  mb: 2,
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <Typography variant="h6" align="center" gutterBottom>
                Đăng ký tài khoản mới
              </Typography>

              <TextField
                label="Tên đăng nhập"
                fullWidth
                margin="normal"
                required
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                disabled={loading}
                helperText="Tối thiểu 3 ký tự"
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                required
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                disabled={loading}
              />

              <TextField
                label="Họ và tên"
                fullWidth
                margin="normal"
                required
                value={registerData.fullName}
                onChange={(e) =>
                  setRegisterData({ ...registerData, fullName: e.target.value })
                }
                disabled={loading}
              />

              <TextField
                label="Số điện thoại"
                fullWidth
                margin="normal"
                required
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
                disabled={loading}
                helperText="10-11 chữ số"
              />

              <TextField
                label="Địa chỉ"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                value={registerData.address}
                onChange={(e) =>
                  setRegisterData({ ...registerData, address: e.target.value })
                }
                disabled={loading}
              />

              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                disabled={loading}
                helperText="Tối thiểu 6 ký tự"
              />

              <TextField
                label="Xác nhận mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                required
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
                disabled={loading}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  marginTop: 2,
                  backgroundColor: "#2196f3",
                  "&:hover": { backgroundColor: "#1976d2" },
                  padding: "12px",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Đăng ký"}
              </Button>
            </Box>
          )}

          {tabValue === 2 && (
            <Box
              component="form"
              onSubmit={handleUserLogin}
              sx={{ padding: 2 }}
            >
              <AdminPanelSettingsIcon
                sx={{
                  fontSize: 80,
                  color: "#ff9800",
                  mb: 2,
                  display: "block",
                  margin: "0 auto",
                }}
              />
              <Typography variant="h6" align="center" gutterBottom>
                Đăng nhập quản trị
              </Typography>

              <TextField
                label="Tên đăng nhập"
                fullWidth
                margin="normal"
                required
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                disabled={loading}
              />

              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                disabled={loading}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  marginTop: 2,
                  backgroundColor: "#ff9800",
                  "&:hover": { backgroundColor: "#e68900" },
                  padding: "12px",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Đăng nhập Admin"}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LockResetIcon color="primary" />
            <Typography variant="h6">Quên mật khẩu</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={forgotPasswordStep} sx={{ mb: 3, mt: 2 }}>
            <Step>
              <StepLabel>Xác thực thông tin</StepLabel>
            </Step>
            <Step>
              <StepLabel>Đặt lại mật khẩu</StepLabel>
            </Step>
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {forgotPasswordStep === 0 && (
            <Box>
              <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                  Chọn phương thức nhận mã OTP
                </FormLabel>
                <RadioGroup
                  value={otpMethod}
                  onChange={(e) => {
                    setOtpMethod(e.target.value);
                    setForgotPasswordData({
                      ...forgotPasswordData,
                      email: "",
                      phone: "",
                    });
                  }}
                  row
                  sx={{ justifyContent: "center", gap: 2 }}
                >
                  <FormControlLabel
                    value="email"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EmailIcon color="primary" />
                        <span>Email</span>
                      </Box>
                    }
                    sx={{
                      border: "2px solid",
                      borderColor:
                        otpMethod === "email" ? "primary.main" : "grey.300",
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      m: 0,
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "primary.light",
                      },
                    }}
                  />
                  <FormControlLabel
                    value="phone"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SmsIcon color="success" />
                        <span>SMS</span>
                      </Box>
                    }
                    sx={{
                      border: "2px solid",
                      borderColor:
                        otpMethod === "phone" ? "success.main" : "grey.300",
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      m: 0,
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "success.main",
                        backgroundColor: "success.light",
                      },
                    }}
                  />
                </RadioGroup>
              </FormControl>

              <Alert
                severity="info"
                icon={otpMethod === "email" ? <EmailIcon /> : <SmsIcon />}
                sx={{ mb: 3 }}
              >
                {otpMethod === "email"
                  ? "Mã OTP sẽ được gửi đến email của bạn"
                  : "Mã OTP sẽ được gửi đến số điện thoại của bạn"}
              </Alert>

              {otpMethod === "email" ? (
                <TextField
                  label="Email *"
                  type="email"
                  fullWidth
                  margin="normal"
                  required
                  value={forgotPasswordData.email}
                  onChange={(e) =>
                    setForgotPasswordData({
                      ...forgotPasswordData,
                      email: e.target.value,
                    })
                  }
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                    ),
                  }}
                  helperText="Nhập email đã đăng ký để nhận mã OTP"
                />
              ) : (
                <TextField
                  label="Số điện thoại *"
                  fullWidth
                  margin="normal"
                  required
                  value={forgotPasswordData.phone}
                  onChange={(e) =>
                    setForgotPasswordData({
                      ...forgotPasswordData,
                      phone: e.target.value,
                    })
                  }
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <SmsIcon sx={{ mr: 1, color: "success.main" }} />
                    ),
                  }}
                  helperText="Nhập số điện thoại đã đăng ký để nhận mã OTP"
                />
              )}
            </Box>
          )}

          {forgotPasswordStep === 1 && (
            <Box>
              <Alert
                severity="info"
                sx={{ mb: 3 }}
                icon={otpMethod === "email" ? <EmailIcon /> : <SmsIcon />}
              >
                {otpMethod === "email" ? (
                  <Box>
                    Mã OTP đã được gửi đến email: <br />
                    <strong>{forgotPasswordData.email}</strong>
                  </Box>
                ) : (
                  <Box>
                    Mã OTP đã được gửi đến số điện thoại: <br />
                    <strong>{forgotPasswordData.phone}</strong>
                  </Box>
                )}
              </Alert>

              <TextField
                label="Mã OTP"
                fullWidth
                margin="normal"
                required
                value={forgotPasswordData.otp}
                onChange={(e) =>
                  setForgotPasswordData({
                    ...forgotPasswordData,
                    otp: e.target.value,
                  })
                }
                disabled={loading}
                helperText="Nhập mã OTP gồm 6 chữ số"
                inputProps={{ maxLength: 6 }}
                placeholder="______"
              />

              <TextField
                label="Mật khẩu mới"
                type="password"
                fullWidth
                margin="normal"
                required
                value={forgotPasswordData.newPassword}
                onChange={(e) =>
                  setForgotPasswordData({
                    ...forgotPasswordData,
                    newPassword: e.target.value,
                  })
                }
                disabled={loading}
                helperText="Tối thiểu 6 ký tự"
              />

              <TextField
                label="Xác nhận mật khẩu mới"
                type="password"
                fullWidth
                margin="normal"
                required
                value={forgotPasswordData.confirmPassword}
                onChange={(e) =>
                  setForgotPasswordData({
                    ...forgotPasswordData,
                    confirmPassword: e.target.value,
                  })
                }
                disabled={loading}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleForgotPasswordClose}
            disabled={loading}
            variant="outlined"
          >
            HỦY
          </Button>

          {forgotPasswordStep === 0 ? (
            <Button
              variant="contained"
              onClick={handleRequestOTP}
              disabled={loading}
              color={otpMethod === "email" ? "primary" : "success"}
              startIcon={otpMethod === "email" ? <EmailIcon /> : <SmsIcon />}
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={20} /> : "GỬI MÃ OTP"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleResetPassword}
              disabled={loading}
              color="success"
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={20} /> : "ĐẶT LẠI MẬT KHẨU"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        sx={{ marginTop: 3 }}
      >
        © 2025 Hệ thống giặt là Prolaundry. All rights reserved.
      </Typography>
    </Container>
  );
}
