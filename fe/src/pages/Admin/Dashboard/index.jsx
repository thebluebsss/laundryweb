import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  People,
  ShoppingCart,
  LocalShipping,
  TrendingUp,
} from "@mui/icons-material";

/**
 * Admin Dashboard Page
 */
const Dashboard = () => {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "1,234",
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#3b82f6",
      bgcolor: "#dbeafe",
    },
    {
      title: "Đơn dịch vụ",
      value: "856",
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      color: "#10b981",
      bgcolor: "#d1fae5",
    },
    {
      title: "Đơn sản phẩm",
      value: "432",
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: "#f59e0b",
      bgcolor: "#fef3c7",
    },
    {
      title: "Doanh thu",
      value: "125M",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#8b5cf6",
      bgcolor: "#ede9fe",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        📊 Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: stat.bgcolor,
                      color: stat.color,
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Thêm charts và tables ở đây */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Hoạt động gần đây
        </Typography>
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Nội dung sẽ được thêm vào...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
