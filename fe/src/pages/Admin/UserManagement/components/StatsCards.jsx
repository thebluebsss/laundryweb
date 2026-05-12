import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { CheckCircle, Block } from "@mui/icons-material";

/**
 * Stats Cards Component - Hiển thị thống kê users
 */
const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#e3f2fd" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Tổng người dùng
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.total}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#e8f5e9" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CheckCircle sx={{ mr: 1, color: "#4caf50" }} />
              <Typography color="textSecondary">Đang hoạt động</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.active}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#ffebee" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Block sx={{ mr: 1, color: "#f44336" }} />
              <Typography color="textSecondary">Đã khóa</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.inactive}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#fff3e0" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Quản trị viên
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.admins}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ bgcolor: "#f3e5f5" }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Người dùng
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {stats.users}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;
