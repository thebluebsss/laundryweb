import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

/**
 * User Form Dialog - Thêm/Sửa user
 */
const UserFormDialog = ({ open, onClose, onSubmit, user, loading }) => {
  const isEdit = !!user;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "user",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        fullName: user.fullName || "",
        phone: user.phone || "",
        role: user.role || "user",
        address: user.address || "",
      });
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phone: "",
        role: "user",
        address: "",
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {isEdit ? "✏️ Chỉnh sửa người dùng" : "➕ Thêm người dùng mới"}
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Tên đăng nhập"
            name="username"
            fullWidth
            margin="normal"
            required
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label={
              isEdit ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"
            }
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required={!isEdit}
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            helperText={isEdit ? "Chỉ nhập nếu muốn thay đổi mật khẩu" : ""}
          />

          <TextField
            label="Họ tên"
            name="fullName"
            fullWidth
            margin="normal"
            required
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label="Số điện thoại"
            name="phone"
            fullWidth
            margin="normal"
            required
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label="Địa chỉ"
            name="address"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={formData.address}
            onChange={handleChange}
            disabled={loading}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Vai trò"
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={isEdit ? "warning" : "primary"}
            disabled={loading}
          >
            {isEdit ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog;
