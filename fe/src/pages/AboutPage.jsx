import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Star,
  LocalLaundryService,
  Speed,
  Nature,
  Security,
  Support,
  Verified,
  Timeline,
  Group,
} from "@mui/icons-material";

const AboutPage = () => {
  const features = [
    {
      icon: <LocalLaundryService />,
      title: "Dịch vụ chuyên nghiệp",
      description:
        "Đội ngũ nhân viên được đào tạo bài bản với kinh nghiệm nhiều năm",
    },
    {
      icon: <Speed />,
      title: "Nhanh chóng tiện lợi",
      description:
        "Lấy và giao đồ tận nơi, tiết kiệm thời gian quý báu của bạn",
    },
    {
      icon: <Nature />,
      title: "Thân thiện môi trường",
      description:
        "Sử dụng hóa chất an toàn, không gây hại cho sức khỏe và môi trường",
    },
    {
      icon: <Security />,
      title: "An toàn bảo mật",
      description:
        "Cam kết bảo vệ tài sản khách hàng với hệ thống bảo mật hiện đại",
    },
    {
      icon: <Support />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ mọi lúc",
    },
    {
      icon: <Verified />,
      title: "Chất lượng đảm bảo",
      description:
        "Cam kết chất lượng dịch vụ với chính sách hoàn tiền nếu không hài lòng",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Khách hàng tin tưởng" },
    { number: "100,000+", label: "Đơn hàng hoàn thành" },
    { number: "15", label: "Cửa hàng trên toàn quốc" },
    { number: "99.5%", label: "Tỷ lệ hài lòng khách hàng" },
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
          🏢 Về Chúng Tôi
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 800, mx: "auto" }}
        >
          ProLaundry - Đối tác tin cậy trong việc chăm sóc quần áo của bạn với
          hơn 6 năm kinh nghiệm
        </Typography>
      </Box>

      {/* Mission & Vision */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🎯 Sứ mệnh
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Mang đến dịch vụ giặt là chất lượng cao, tiện lợi và đáng tin cậy,
              giúp khách hàng tiết kiệm thời gian và có cuộc sống thoải mái hơn.
              Chúng tôi cam kết sử dụng công nghệ hiện đại và quy trình chuyên
              nghiệp để bảo vệ quần áo của bạn như chính đồ của chúng tôi.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: "100%",
              background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🔮 Tầm nhìn
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Trở thành thương hiệu dịch vụ giặt là hàng đầu Việt Nam, được
              khách hàng tin tưởng và lựa chọn số 1. Chúng tôi hướng tới việc
              ứng dụng công nghệ AI và IoT để tối ưu hóa quy trình, mang lại
              trải nghiệm tuyệt vời nhất cho khách hàng.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Stats */}
      <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          📊 Thành tích đạt được
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Features */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          ⭐ Tại sao chọn chúng tôi?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact Info */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          📞 Liên hệ với chúng tôi
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Hotline
              </Typography>
              <Typography variant="body1" color="primary">
                0969263238
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" color="primary">
                thebluebsss@gmail.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Địa chỉ
              </Typography>
              <Typography variant="body1" color="primary">
                HUST
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutPage;
