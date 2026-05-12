import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  ShoppingCart,
  HourglassEmpty,
  CheckCircle,
  LocalShipping,
  Inventory,
  Cancel,
} from "@mui/icons-material";

/**
 * Stats Cards Component - Thống kê đơn hàng sản phẩm
 */
const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ bgcolor: "#e3f2fd" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ShoppingCart sx={{ mr: 1, color: "#1976d2" }} />
              <Typography color="textSecondary">Tổng đơn hàng</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.total || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ bgcolor: "#fff3e0" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HourglassEmpty sx={{ mr: 1, color: "#ff9800" }} />
              <Typography color="textSecondary">Chờ xử lý</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.pending || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ bgcolor: "#e1f5fe" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CheckCircle sx={{ mr: 1, color: "#03a9f4" }} />
              <Typography color="textSecondary">Đã xác nhận</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.confirmed || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ bgcolor: "#f3e5f5" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocalShipping sx={{ mr: 1, color: "#9c27b0" }} />
              <Typography color="textSecondary">Đã giao vận</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.shipped || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ bgcolor: "#e8f5e9" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Inventory sx={{ mr: 1, color: "#4caf50" }} />
              <Typography color="textSecondary">Đã giao hàng</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.delivered || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <Card sx={{ bgcolor: "#ffebee" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Cancel sx={{ mr: 1, color: "#f44336" }} />
              <Typography color="textSecondary">Đã hủy</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.cancelled || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;
