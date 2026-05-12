import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  HourglassEmpty,
  LocalShipping,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

/**
 * Stats Cards Component - Thống kê đơn hàng
 */
const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#e3f2fd" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Tổng đơn hàng
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.total}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#fff3e0" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HourglassEmpty sx={{ mr: 1, color: "#ff9800" }} />
              <Typography color="textSecondary">Chờ xử lý</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.pending}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#e1f5fe" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocalShipping sx={{ mr: 1, color: "#03a9f4" }} />
              <Typography color="textSecondary">Đã xác nhận</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.confirmed}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#e8f5e9" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CheckCircle sx={{ mr: 1, color: "#4caf50" }} />
              <Typography color="textSecondary">Hoàn thành</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.completed}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#ffebee" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Cancel sx={{ mr: 1, color: "#f44336" }} />
              <Typography color="textSecondary">Đã hủy</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.cancelled}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;
