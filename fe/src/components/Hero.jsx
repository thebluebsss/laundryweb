import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Phone,
  Schedule,
  LocalShipping,
  Star,
  PlayArrow,
  ArrowForward,
  CheckCircle,
  Nature,
  Security,
  Speed,
} from "@mui/icons-material";

const HeroImproved = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "GIAO NHẬN TẬN NƠI",
      subtitle: "Dịch vụ giặt là chuyên nghiệp",
      description:
        "Tiết kiệm thời gian, tận hưởng cuộc sống với dịch vụ giặt là cao cấp",
      phone: "0969263238",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "CHẤT LƯỢNG 5 SAO",
      subtitle: "Công nghệ hiện đại",
      description:
        "Máy móc hiện đại, hóa chất an toàn, đảm bảo chất lượng tốt nhất",
      phone: "0969263238",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "GIÁ CẢ CẠNH TRANH",
      subtitle: "Ưu đãi hấp dẫn",
      description:
        "Giá cả phải chăng, nhiều chương trình khuyến mãi cho khách hàng thân thiết",
      phone: "0969263238",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  const features = [
    {
      icon: <LocalShipping />,
      title: "Giao nhận miễn phí",
      description: "Trong bán kính 5km",
    },
    {
      icon: <Speed />,
      title: "Nhanh chóng",
      description: "Hoàn thành trong 24h",
    },
    {
      icon: <Security />,
      title: "An toàn",
      description: "Bảo đảm chất lượng 100%",
    },
    {
      icon: <Nature />,
      title: "Thân thiện",
      description: "Hóa chất không độc hại",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Khách hàng hài lòng" },
    { number: "5", label: "Năm kinh nghiệm" },
    { number: "24/7", label: "Hỗ trợ khách hàng" },
    { number: "99%", label: "Tỷ lệ hài lòng" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <Box
      sx={{
        minHeight: "90vh",
        background: currentHero.gradient,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        transition: "all 0.8s ease",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 80%, white 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, white 2px, transparent 2px),
            radial-gradient(circle at 40% 40%, white 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px, 150px 150px, 75px 75px",
          animation: "float 20s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 8 } }}
      >
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} lg={6}>
            <Fade in key={currentSlide} timeout={800}>
              <Box sx={{ textAlign: { xs: "center", lg: "left" } }}>
                <Chip
                  label="🏆 Dịch vụ giặt là #1"
                  sx={{
                    mb: 3,
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                />

                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  fontWeight="bold"
                  color="white"
                  sx={{ mb: 2, lineHeight: 1.2 }}
                >
                  {currentHero.title}
                </Typography>

                <Typography
                  variant="h5"
                  color="rgba(255, 255, 255, 0.9)"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  {currentHero.subtitle}
                </Typography>

                <Typography
                  variant="h6"
                  color="rgba(255, 255, 255, 0.8)"
                  sx={{ mb: 4, lineHeight: 1.6 }}
                >
                  {currentHero.description}
                </Typography>

                {/* Phone Number */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                    p: 2,
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: 3,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      width: 50,
                      height: 50,
                    }}
                  >
                    <Phone />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      color="rgba(255, 255, 255, 0.8)"
                    >
                      Hotline 24/7
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="white">
                      {currentHero.phone}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/dat-lich")}
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    endIcon={<ArrowForward />}
                  >
                    ĐẶT LỊCH NGAY
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/bang-gia")}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                    startIcon={<PlayArrow />}
                  >
                    XEM BẢNG GIÁ
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Right Content - Features */}
          <Grid item xs={12} lg={6}>
            <Slide direction="left" in timeout={1000}>
              <Box sx={{ mt: { xs: 4, lg: 0 } }}>
                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid item xs={6} key={index}>
                      <Card
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: 4,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            bgcolor: "rgba(255, 255, 255, 0.25)",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(255, 255, 255, 0.2)",
                              mx: "auto",
                              mb: 2,
                              width: 60,
                              height: 60,
                            }}
                          >
                            {feature.icon}
                          </Avatar>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="white"
                            sx={{ mb: 1 }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="rgba(255, 255, 255, 0.9)"
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
            </Slide>
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Box sx={{ mt: { xs: 6, md: 10 } }}>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: 3,
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h2"
                    fontWeight="bold"
                    color="white"
                    sx={{ mb: 1, fontSize: { xs: "2rem", md: "3rem" } }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="rgba(255, 255, 255, 0.9)"
                    fontWeight="medium"
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Slide Indicators */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mt: 4,
          }}
        >
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor:
                  currentSlide === index ? "white" : "rgba(255, 255, 255, 0.4)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "white",
                },
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Scroll Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "bounce 2s infinite",
          "@keyframes bounce": {
            "0%, 20%, 50%, 80%, 100%": {
              transform: "translateX(-50%) translateY(0)",
            },
            "40%": { transform: "translateX(-50%) translateY(-10px)" },
            "60%": { transform: "translateX(-50%) translateY(-5px)" },
          },
        }}
      >
        <IconButton
          sx={{
            color: "white",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
          }}
        >
          <ArrowForward sx={{ transform: "rotate(90deg)" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default HeroImproved;
