import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Divider,
  Chip,
  Alert,
  Fade,
  useTheme,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  Send,
  LocalLaundryService,
  Phone,
  Email,
  LocationOn,
  Schedule,
} from "@mui/icons-material";

const FooterImproved = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const theme = useTheme();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { to: "/home", label: "Trang Chủ" },
    { to: "/ve-chung-toi", label: "Về Chúng Tôi" },
    { to: "/dich-vu", label: "Dịch Vụ" },
    { to: "/bang-gia", label: "Bảng Giá" },
  ];

  const serviceLinks = [
    { to: "/lien-he", label: "Liên Hệ" },
    { to: "/dat-lich", label: "Đặt Lịch Ngay" },
    { to: "/tin-tuc", label: "Tin Tức" },
    { to: "/san-pham", label: "Sản Phẩm" },
  ];

  const contactInfo = [
    { icon: <Phone />, text: "0969263238" },
    { icon: <Email />, text: "thebluebsss@gmail.com" },
    { icon: <LocationOn />, text: "HUST" },
    { icon: <Schedule />, text: "7:00 - 22:00 (Thứ 2 - Chủ nhật)" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        color: "white",
        mt: "auto",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      }}
    >
      {/* Decorative wave */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 4, md: 6 } }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: { xs: 4, md: 0 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalLaundryService
                  sx={{ fontSize: 40, color: "#667eea", mr: 1 }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  PROLAUNDRY
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                Dịch vụ giặt sấy chuyên nghiệp với công nghệ hiện đại.
                <strong> Save Time, Enjoy Life.</strong>
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Chip
                  label="⭐ 4.9/5 Rating"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 193, 7, 0.2)",
                    color: "#ffc107",
                    fontWeight: "bold",
                  }}
                />
                <Chip
                  label="🚚 Free Delivery"
                  size="small"
                  sx={{
                    bgcolor: "rgba(76, 175, 80, 0.2)",
                    color: "#4caf50",
                    fontWeight: "bold",
                  }}
                />
              </Box>

              {/* Social Icons */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {[
                  { icon: <Facebook />, color: "#1877f2" },
                  { icon: <Twitter />, color: "#1da1f2" },
                  { icon: <Instagram />, color: "#e4405f" },
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      "&:hover": {
                        bgcolor: social.color,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Liên Kết Nhanh
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#667eea";
                    e.target.style.paddingLeft = "8px";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(255, 255, 255, 0.8)";
                    e.target.style.paddingLeft = "0px";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Dịch Vụ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {serviceLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#667eea";
                    e.target.style.paddingLeft = "8px";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(255, 255, 255, 0.8)";
                    e.target.style.paddingLeft = "0px";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Thông Tin Liên Hệ
            </Typography>

            <Box sx={{ mb: 3 }}>
              {contactInfo.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                    color: "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <Box
                    sx={{
                      color: "#667eea",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography variant="body2">{info.text}</Typography>
                </Box>
              ))}
            </Box>

            {/* Newsletter Subscription */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                📧 Đăng Ký Nhận Tin
              </Typography>
              <Typography variant="caption" sx={{ mb: 2, display: "block" }}>
                Nhận thông tin ưu đãi và tin tức mới nhất
              </Typography>

              {subscribed && (
                <Fade in>
                  <Alert
                    severity="success"
                    sx={{ mb: 2, bgcolor: "rgba(76, 175, 80, 0.2)" }}
                  >
                    Đăng ký thành công! 🎉
                  </Alert>
                </Fade>
              )}

              <Box
                component="form"
                onSubmit={handleSubscribe}
                sx={{ display: "flex", gap: 1 }}
              >
                <TextField
                  size="small"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    minWidth: "auto",
                    px: 2,
                  }}
                >
                  <Send />
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            © 2025 Prolaundry. Tất cả quyền được bảo lưu.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                "&:hover": { color: "#667eea" },
              }}
            >
              Chính sách bảo mật
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                "&:hover": { color: "#667eea" },
              }}
            >
              Điều khoản sử dụng
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterImproved;
