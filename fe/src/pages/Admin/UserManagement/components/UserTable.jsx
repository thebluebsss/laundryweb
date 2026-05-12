import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Visibility, Delete, Edit } from "@mui/icons-material";

/**
 * User Table Component
 */
const UserTable = ({ users, onView, onEdit, onDelete, onToggleActive }) => {
  if (users.length === 0) {
    return (
      <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
        Không có người dùng nào
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell>
              <strong>Tên đăng nhập</strong>
            </TableCell>
            <TableCell>
              <strong>Họ tên</strong>
            </TableCell>
            <TableCell>
              <strong>Email</strong>
            </TableCell>
            <TableCell>
              <strong>Số điện thoại</strong>
            </TableCell>
            <TableCell>
              <strong>Vai trò</strong>
            </TableCell>
            <TableCell>
              <strong>Trạng thái</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Thao tác</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} hover>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Chip
                  label={user.role === "admin" ? "Admin" : "User"}
                  color={user.role === "admin" ? "error" : "primary"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.isActive}
                      onChange={() => onToggleActive(user)}
                      color="success"
                    />
                  }
                  label={user.isActive ? "Hoạt động" : "Đã khóa"}
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() => onView(user)}
                  title="Xem chi tiết"
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  color="warning"
                  onClick={() => onEdit(user)}
                  title="Chỉnh sửa"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(user)}
                  title="Xóa"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
