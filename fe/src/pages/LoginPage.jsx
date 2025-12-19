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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function LoginPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      navigate("/admin");
    } else if (userRole === "guest") {
      navigate("/home");
    }
  }, [navigate]);

  const handleGuestLogin = () => {
    localStorage.setItem("userRole", "guest");
    navigate("/home");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    if (adminUsername === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
      localStorage.setItem("userRole", "admin");
      navigate("/admin");
    } else {
      setError("Sai tên đăng nhập hoặc mật khẩu!");
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
            onChange={(e, newValue) => setTabValue(newValue)}
            centered
            sx={{ marginBottom: 3 }}
          >
            <Tab icon={<PersonIcon />} label="Khách hàng" />
            <Tab icon={<AdminPanelSettingsIcon />} label="Quản trị viên" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ textAlign: "center", padding: 3 }}>
              <PersonIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Chào mừng khách hàng!
              </Typography>
              <Typography color="textSecondary" paragraph>
                Nhấn nút bên dưới để vào trang chủ
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleGuestLogin}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#45a049" },
                  padding: "12px",
                  fontSize: "16px",
                }}
              >
                Vào Trang Chủ
              </Button>
            </Box>
          )}

          {tabValue === 1 && (
            <Box
              component="form"
              onSubmit={handleAdminLogin}
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

              {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Tên đăng nhập"
                fullWidth
                margin="normal"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />

              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  marginTop: 2,
                  backgroundColor: "#ff9800",
                  "&:hover": { backgroundColor: "#e68900" },
                  padding: "12px",
                }}
              >
                Đăng nhập Admin
              </Button>

              <Typography
                variant="caption"
                display="block"
                align="center"
                sx={{ marginTop: 2, color: "#666" }}
              ></Typography>
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
