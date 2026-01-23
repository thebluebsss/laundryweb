import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Paper,
  useTheme,
} from "@mui/material";
import {
  LocalLaundryService,
  DryCleaning,
  Business,
  CheckCircle,
  Timer,
  Nature,
  Star,
} from "@mui/icons-material";

const ServicesImproved = () => {
  const theme = useTheme();

  const services = [
    {
      icon: <LocalLaundryService sx={{ fontSize: 40 }} />,
      title: "GIẶT ƯỚT SẤY KHÔ",
      description:
        "Chúng tôi làm sạch đồ của bạn một cách nhanh chóng, hiệu quả với công nghệ hiện đại",
      color: "#2196F3",
      gradient: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
      features: ["Nhanh chóng", "Hiệu quả", "An toàn"],
      popular: true,
    },
    {
      icon: <DryCleaning sx={{ fontSize: 40 }} />,
      title: "GIẶT KHÔ LÀ HƠI",
      description:
        "Giặt khô đảm bảo đồ của bạn sạch sẽ và bảo vệ được chất liệu vải không bị co dãn hoặc mất màu",
      color: "#9C27B0",
      gradient: "linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)",
      features: ["Bảo vệ vải", "Không co dãn", "Giữ màu"],
      popular: false,
    },
    {
      icon: <Business sx={{ fontSize: 40 }} />,
      title: "GIẶT LÀ CÔNG NGHIỆP",
      description:
        "Với máy giặt công suất lớn chúng tôi có thể giặt tẩy lượng lớn đồ vải của nhà hàng, khách sạn.... hoặc giặt đồng phục nhân viên",
      color: "#4CAF50",
      gradient: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
      features: ["Công suất lớn", "Chuyên nghiệp", "Giá tốt"],
      popular: false,
    },
  ];

  const benefits = [
    { icon: <Timer />, text: "Giao nhận tận nơi" },
    { icon: <Nature />, text: "Thân thiện môi trường" },
    { icon: <CheckCircle />, text: "Đảm bảo chất lượng" },
    { icon: <Star />, text: "Dịch vụ 5 sao" },
  ];

  return (
    <Box
      sx={{
        py: 8,
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              mb: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🧺 DỊCH VỤ CỦA CHÚNG TÔI
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
          >
            Chúng tôi cung cấp các dịch vụ giặt là chuyên nghiệp với công nghệ
            hiện đại và đội ngũ nhân viên giàu kinh nghiệm
          </Typography>
        </Box>

        {/* Benefits */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            mb: { xs: 6, md: 8 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>\') repeat',
              backgroundSize: "50px 50px",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              sx={{ mb: 4 }}
            >
              ✨ Tại sao chọn chúng tôi?
            </Typography>
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        width: 60,
                        height: 60,
                      }}
                    >
                      {benefit.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {benefit.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 40px ${service.color}30`,
                  },
                  border: service.popular
                    ? `3px solid ${service.color}`
                    : "none",
                }}
              >
                {service.popular && (
                  <Chip
                    label="🔥 Phổ biến"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      zIndex: 1,
                      background: service.gradient,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                )}

                {/* Header with gradient */}
                <Box
                  sx={{
                    background: service.gradient,
                    color: "white",
                    p: 3,
                    textAlign: "center",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "20px",
                      background: "white",
                      clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    {service.title}
                  </Typography>
                </Box>

                <CardContent sx={{ p: 3, pt: 4 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {service.description}
                  </Typography>

                  {/* Features */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {service.features.map((feature, featureIndex) => (
                      <Chip
                        key={featureIndex}
                        label={feature}
                        size="small"
                        sx={{
                          bgcolor: `${service.color}15`,
                          color: service.color,
                          fontWeight: "bold",
                          border: `1px solid ${service.color}30`,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>

                {/* Bottom accent */}
                <Box
                  sx={{
                    height: 4,
                    background: service.gradient,
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Sẵn sàng trải nghiệm dịch vụ?
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Đặt lịch ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới!
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              label="📞 Hotline: 0969263238"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
                height: 40,
              }}
            />
            <Chip
              label="🕒 Phục vụ 7:00 - 22:00"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
                height: 40,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesImproved;
