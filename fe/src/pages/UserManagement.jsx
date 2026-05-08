import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  Delete,
  Edit,
  Add,
  Search,
  Refresh,
  PersonAdd,
  Block,
  CheckCircle,
} from "@mui/icons-material";
import config from "../config/api";
const API_BASE_URL = config.API_BASE_URL;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Dialogs
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    users: 0,
  });

  // Form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "user",
    address: "",
  });

  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage]);

  const getToken = () => localStorage.getItem("token");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/users?page=${currentPage}&limit=${usersPerPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        // Backend trả về { success, message, data: { users, pagination } }
        const { users, pagination } = data.data;
        setUsers(users);
        setTotalPages(pagination.pages);
      } else {
        setErrorMessage(data.message || "Không thể tải danh sách người dùng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users-stats`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Lỗi thống kê:", error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setCurrentPage(1);
    loadUsers();
    loadStats();
    showSuccess("Đã làm mới danh sách!");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess("Thêm người dùng thành công!");
        setOpenAddDialog(false);
        resetForm();
        loadUsers();
        loadStats();
      } else {
        setErrorMessage(data.message || "Không thể thêm người dùng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi khi thêm người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/${selectedUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      const data = await response.json();

      if (data.success) {
        showSuccess("Cập nhật người dùng thành công!");
        setOpenEditDialog(false);
        resetForm();
        loadUsers();
      } else {
        setErrorMessage(data.message || "Không thể cập nhật người dùng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi khi cập nhật người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${userToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        showSuccess("Xóa người dùng thành công!");
        setOpenDeleteDialog(false);
        setUserToDelete(null);
        loadUsers();
        loadStats();
      } else {
        setErrorMessage(data.message || "Không thể xóa người dùng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi khi xóa người dùng");
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${user._id}/toggle-active`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);
        loadUsers();
        loadStats();
      } else {
        setErrorMessage(data.message || "Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi khi cập nhật trạng thái");
    }
  };

  const openEditDialogHandler = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      address: user.address || "",
    });
    setOpenEditDialog(true);
  };

  const openViewDialogHandler = (user) => {
    setSelectedUser(user);
    setOpenViewDialog(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
      phone: "",
      role: "user",
      address: "",
    });
    setSelectedUser(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        👥 Quản lý người dùng
      </Typography>

      {/* Stats Cards */}
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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Tìm kiếm (tên, email, SĐT...)"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              disabled={loading}
              sx={{ height: 56 }}
            >
              Tìm
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ height: 56 }}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<PersonAdd />}
              onClick={() => {
                resetForm();
                setOpenAddDialog(true);
              }}
              sx={{ height: 56 }}
            >
              Thêm mới
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            📋 Danh sách người dùng ({users.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="textSecondary">
                            Không có người dùng nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.fullName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role === "admin" ? "Admin" : "User"}
                              color={
                                user.role === "admin" ? "error" : "primary"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={user.isActive}
                                  onChange={() => handleToggleActive(user)}
                                  color="success"
                                />
                              }
                              label={user.isActive ? "Hoạt động" : "Đã khóa"}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              onClick={() => openViewDialogHandler(user)}
                              title="Xem chi tiết"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              color="warning"
                              onClick={() => openEditDialogHandler(user)}
                              title="Chỉnh sửa"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setUserToDelete(user);
                                setOpenDeleteDialog(true);
                              }}
                              title="Xóa"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleAddUser}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            ➕ Thêm người dùng mới
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Tên đăng nhập"
              fullWidth
              margin="normal"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              margin="normal"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <TextField
              label="Họ tên"
              fullWidth
              margin="normal"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              margin="normal"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <TextField
              label="Địa chỉ"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.role}
                label="Vai trò"
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              Thêm
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleEditUser}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            ✏️ Chỉnh sửa người dùng
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Tên đăng nhập"
              fullWidth
              margin="normal"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextField
              label="Mật khẩu mới (để trống nếu không đổi)"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              helperText="Chỉ nhập nếu muốn thay đổi mật khẩu"
            />
            <TextField
              label="Họ tên"
              fullWidth
              margin="normal"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              margin="normal"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <TextField
              label="Địa chỉ"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.role}
                label="Vai trò"
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={loading}
            >
              Cập nhật
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          👤 Chi tiết người dùng
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Tên đăng nhập:
                </Typography>
                <Typography variant="body1">{selectedUser.username}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Email:
                </Typography>
                <Typography variant="body1">{selectedUser.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Họ tên:
                </Typography>
                <Typography variant="body1">{selectedUser.fullName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Số điện thoại:
                </Typography>
                <Typography variant="body1">{selectedUser.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Địa chỉ:
                </Typography>
                <Typography variant="body1">
                  {selectedUser.address || "Chưa có"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Vai trò:
                </Typography>
                <Chip
                  label={selectedUser.role === "admin" ? "Admin" : "User"}
                  color={selectedUser.role === "admin" ? "error" : "primary"}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Trạng thái:
                </Typography>
                <Chip
                  label={selectedUser.isActive ? "Hoạt động" : "Đã khóa"}
                  color={selectedUser.isActive ? "success" : "error"}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày tạo:
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedUser.createdAt)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Đăng nhập lần cuối:
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedUser.lastLogin)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>⚠️ Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{userToDelete?.fullName}</strong> ({userToDelete?.username}
            )?
          </Typography>
          <Typography color="error" sx={{ mt: 1 }}>
            Thao tác này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
