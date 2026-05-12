import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
} from "@mui/material";

/**
 * User Detail Dialog - Xem chi tiết user
 */
const UserDetailDialog = ({ open, onClose, user }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        👤 Chi tiết người dùng
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Tên đăng nhập:
            </Typography>
            <Typography variant="body1">{user.username}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Email:
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Họ tên:
            </Typography>
            <Typography variant="body1">{user.fullName}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Số điện thoại:
            </Typography>
            <Typography variant="body1">{user.phone}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Địa chỉ:
            </Typography>
            <Typography variant="body1">{user.address || "Chưa có"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Vai trò:
            </Typography>
            <Chip
              label={user.role === "admin" ? "Admin" : "User"}
              color={user.role === "admin" ? "error" : "primary"}
              size="small"
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Trạng thái:
            </Typography>
            <Chip
              label={user.isActive ? "Hoạt động" : "Đã khóa"}
              color={user.isActive ? "success" : "error"}
              size="small"
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Ngày tạo:
            </Typography>
            <Typography variant="body1">
              {formatDate(user.createdAt)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Đăng nhập lần cuối:
            </Typography>
            <Typography variant="body1">
              {formatDate(user.lastLogin)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailDialog;
