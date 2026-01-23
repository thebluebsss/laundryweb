import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material";
import {
  ExpandMore,
  LocalLaundryService,
  DryCleaningOutlined,
  CheckroomOutlined,
  HomeOutlined,
  StarOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const priceData = {
  dryClean: {
    "Bộ đồ": [
      { name: "Bộ Complete", price: 80000, popular: true },
      { name: "Bộ kí giả", price: 60000 },
      { name: "Bộ đồ thể thao", price: 40000 },
      { name: "Bộ đồ ngủ", price: 35000 },
      { name: "Bộ quần áo gió (mỏng)", price: 35000 },
      { name: "Bộ vét nữ", price: 70000, popular: true },
      { name: "Bộ vét không lót", price: 55000 },
      { name: "Bộ quần áo dài nhung", price: 90000 },
      { name: "Bộ quần áo dài thường", price: 80000 },
    ],
    Áo: [
      { name: "Áo sơ mi", price: 20000, popular: true },
      { name: "Áo vest", price: 45000 },
      { name: "Áo khoác", price: 35000 },
      { name: "Áo len", price: 25000 },
      { name: "Áo dạ", price: 50000 },
    ],
    Quần: [
      { name: "Quần tây", price: 25000 },
      { name: "Quần jean", price: 20000 },
      { name: "Quần kaki", price: 18000 },
      { name: "Quần short", price: 15000 },
    ],
    Váy: [
      { name: "Váy công sở", price: 30000 },
      { name: "Váy dạ hội", price: 60000 },
      { name: "Váy jean", price: 25000 },
    ],
    "Chăn gối": [
      { name: "Chăn đơn", price: 40000 },
      { name: "Chăn đôi", price: 60000 },
      { name: "Gối", price: 15000 },
      { name: "Nệm", price: 80000 },
    ],
    "Đồ đặc biệt": [
      { name: "Áo cưới", price: 150000 },
      { name: "Váy cưới", price: 200000 },
      { name: "Đồ da", price: 100000 },
      { name: "Đồ lông thú", price: 120000 },
    ],
  },
  wetWash: {
    "Giặt theo kg": [
      { name: "Giặt sấy thường (1kg)", price: 25000, popular: true },
      { name: "Giặt khô (1kg)", price: 35000, popular: true },
      { name: "Giặt ủi (1kg)", price: 30000, popular: true },
    ],
    "Dịch vụ thêm": [
      { name: "Đồ giặt khô (thêm)", price: 15000 },
      { name: "Túi giặt", price: 5000 },
      { name: "Nước xả vải cao cấp", price: 10000 },
      { name: "Hương thơm đặc biệt", price: 8000 },
    ],
    "Gói combo": [
      { name: "Combo gia đình (5kg)", price: 100000, popular: true },
      { name: "Combo sinh viên (3kg)", price: 65000 },
      { name: "Combo văn phòng (2kg)", price: 45000 },
    ],
  },
};

const topServices = [
  {
    icon: <CheckroomOutlined sx={{ fontSize: 40 }} />,
    title: "Giặt áo sơ mi",
    price: "Chỉ từ 20.000đ/chiếc",
    description: "Chuyên nghiệp, nhanh chóng",
    color: "#4CAF50",
  },
  {
    icon: <LocalLaundryService sx={{ fontSize: 40 }} />,
    title: "Giặt ướt sấy khô",
    price: "Chỉ từ 25.000đ/kg",
    description: "Tối thiểu 3kg, miễn phí lấy giao",
    color: "#2196F3",
  },
  {
    icon: <DryCleaningOutlined sx={{ fontSize: 40 }} />,
    title: "Giặt khô là hơi",
    price: "Chỉ từ 35.000đ/kg",
    description: "Bảo vệ chất liệu, không phai màu",
    color: "#FF9800",
  },
];

function PricePage() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentData = activeTab === 0 ? priceData.dryClean : priceData.wetWash;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: { xs: 3, md: 4 } }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={() => navigate("/home")}
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <HomeOutlined fontSize="small" />
          Trang chủ
        </Link>
        <Typography color="text.primary">Bảng giá</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🏷️ Bảng Giá Dịch Vụ
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Dịch vụ chất lượng luôn đi kèm với mức giá phải chăng
        </Typography>
        <Divider
          sx={{
            width: 100,
            mx: "auto",
            borderWidth: 2,
            borderColor: "#4CAF50",
          }}
        />
      </Box>

      {/* Top Services */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ⭐ Dịch Vụ Hàng Đầu
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {topServices.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                  border: `2px solid ${service.color}20`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      color: service.color,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={service.color}
                    gutterBottom
                  >
                    {service.price}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Price Tables */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📋 Bảng Giá Chi Tiết
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                minHeight: 72,
                fontSize: "1.1rem",
                fontWeight: "bold",
              },
            }}
          >
            <Tab
              icon={<DryCleaningOutlined />}
              label="Giặt Khô Là Hơi"
              iconPosition="start"
            />
            <Tab
              icon={<LocalLaundryService />}
              label="Giặt Ướt Sấy Khô"
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {Object.entries(currentData).map(([category, items]) => (
              <Accordion key={category} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    "&:hover": { backgroundColor: "#e8f5e8" },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {category} ({items.length} mục)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Tên dịch vụ</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Giá</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Trạng thái</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items.map((item, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:nth-of-type(odd)": {
                                backgroundColor: "#fafafa",
                              },
                              "&:hover": { backgroundColor: "#f0f8ff" },
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {item.popular && (
                                  <StarOutlined
                                    sx={{ color: "#FF9800", fontSize: 20 }}
                                  />
                                )}
                                {item.name}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="h6"
                                color="primary"
                                fontWeight="bold"
                              >
                                {formatCurrency(item.price)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {item.popular && (
                                <Chip
                                  label="Phổ biến"
                                  color="warning"
                                  size="small"
                                  icon={<StarOutlined />}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Additional Info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              📝 Lưu ý quan trọng
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Giá có thể thay đổi tùy theo chất liệu và độ bẩn</li>
              <li>Miễn phí lấy và giao hàng trong bán kính 5km</li>
              <li>Thời gian hoàn thành: 24-48 giờ</li>
              <li>Bảo hành chất lượng 100%</li>
            </ul>
          </Alert>
        </Grid>
        <Grid item xs={12} md={6}>
          <Alert severity="success">
            <Typography variant="h6" gutterBottom>
              🎁 Ưu đãi đặc biệt
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Giảm 10% cho khách hàng thân thiết</li>
              <li>Miễn phí vận chuyển đơn hàng trên 500k</li>
              <li>Tích điểm đổi quà hấp dẫn</li>
              <li>Combo gia đình tiết kiệm đến 20%</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PricePage;
