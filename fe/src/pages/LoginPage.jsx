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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const API_BASE_URL = "http://localhost:3001/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Register form
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

    // Validate
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
