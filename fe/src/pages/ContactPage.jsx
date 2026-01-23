import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Send,
  Facebook,
  Instagram,
  YouTube,
} from "@mui/icons-material";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: "Hotline",
      content: "1900 1234",
      subContent: "Hỗ trợ 24/7",
      color: "#4CAF50",
    },
    {
      icon: <Email />,
      title: "Email",
      content: "info@prolaundry.vn",
      subContent: "support@prolaundry.vn",
      color: "#2196F3",
    },
    {
      icon: <LocationOn />,
      title: "Địa chỉ",
      content: "123 Nguyễn Văn Linh, Q.7",
      subContent: "TP. Hồ Chí Minh",
      color: "#FF5722",
    },
    {
      icon: <AccessTime />,
      title: "Giờ làm việc",
      content: "6:00 - 22:00",
      subContent: "Tất cả các ngày trong tuần",
      color: "#9C27B0",
    },
  ];

  const branches = [
    {
      name: "Chi nhánh Quận 1",
      address: "456 Lê Lợi, Quận 1, TP.HCM",
      phone: "028 3822 1234",
    },
    {
      name: "Chi nhánh Quận 3",
      address: "789 Võ Văn Tần, Quận 3, TP.HCM",
      phone: "028 3930 5678",
    },
    {
      name: "Chi nhánh Thủ Đức",
      address: "321 Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
      phone: "028 3715 9012",
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook />,
      name: "Facebook",
      url: "https://facebook.com/prolaundry",
      color: "#1877F2",
    },
    {
      icon: <Instagram />,
      name: "Instagram",
      url: "https://instagram.com/prolaundry",
      color: "#E4405F",
    },
    {
      icon: <YouTube />,
      name: "YouTube",
      url: "https://youtube.com/prolaundry",
      color: "#FF0000",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📞 Liên Hệ Với Chúng Tôi
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
        >
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng
          tôi qua các kênh dưới đây.
        </Typography>
      </Box>

      {/* Contact Info Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {contactInfo.map((info, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: info.color,
                    color: "white",
                    mb: 2,
                  }}
                >
                  {info.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {info.title}
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="bold">
                  {info.content}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.subContent}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              📝 Gửi tin nhắn cho chúng tôi
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Điền thông tin vào form dưới đây, chúng tôi sẽ phản hồi trong vòng
              24 giờ.
            </Typography>

            {submitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tiêu đề *"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nội dung tin nhắn *"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      },
                    }}
                    disabled={submitted}
                  >
                    {submitted ? "Đã gửi" : "Gửi tin nhắn"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Branches */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🏢 Hệ thống chi nhánh
            </Typography>
            <List>
              {branches.map((branch, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={branch.name}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {branch.address}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight="bold"
                        >
                          {branch.phone}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Social Media */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🌐 Theo dõi chúng tôi
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={social.icon}
                  href={social.url}
                  target="_blank"
                  sx={{
                    justifyContent: "flex-start",
                    borderColor: social.color,
                    color: social.color,
                    "&:hover": {
                      borderColor: social.color,
                      bgcolor: `${social.color}10`,
                    },
                  }}
                >
                  {social.name}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Map Section */}
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          🗺️ Vị trí cửa hàng chính
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: 400,
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            🗺️ Google Maps sẽ được tích hợp tại đây
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
        </Typography>
      </Paper>
    </Container>
  );
};

export default ContactPage;
