import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  Inventory,
  CheckCircle,
  Warning,
  TrendingUp,
} from "@mui/icons-material";

/**
 * Stats Cards Component - Thống kê sản phẩm
 */
const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: "#e3f2fd" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Inventory sx={{ mr: 1, color: "#1976d2" }} />
              <Typography color="textSecondary">Tổng sản phẩm</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.total || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: "#e8f5e9" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CheckCircle sx={{ mr: 1, color: "#4caf50" }} />
              <Typography color="textSecondary">Còn hàng</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.inStock || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: "#fff3e0" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Warning sx={{ mr: 1, color: "#ff9800" }} />
              <Typography color="textSecondary">Sắp hết</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.lowStock || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: "#f3e5f5" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TrendingUp sx={{ mr: 1, color: "#9c27b0" }} />
              <Typography color="textSecondary">Đã bán</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.sold || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;
