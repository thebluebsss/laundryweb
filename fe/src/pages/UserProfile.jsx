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
  Avatar,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Lock,
  ShoppingBag,
  Edit,
  Save,
  Cancel,
  Visibility,
  Phone,
  Email,
  Home,
  AccountCircle,
} from "@mui/icons-material";
import config from "../config/api";
const API_BASE_URL = config.API_BASE_URL;

export default function UserProfile() {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // User info
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
    role: "",
    createdAt: "",
    lastLogin: "",
  });

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (currentTab === 2) {
      loadUserBookings();
    }
  }, [currentTab]);

  const getToken = () => localStorage.getItem("token");

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();
      console.log("Profile API Response:", data); // Debug log

      if (data.success) {
        setUserInfo(data.data);
        setEditData(data.data);

        // Cập nhật localStorage nếu chưa có
        localStorage.setItem("userName", data.data.fullName);
        localStorage.setItem("userPhone", data.data.phone);
        localStorage.setItem("userAddress", data.data.address || "");
      } else {
        showMessage(
          "error",
          data.message || "Không thể tải thông tin tài khoản"
        );
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      showMessage("error", "Lỗi kết nối đến server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserBookings = async () => {
    setLoadingBookings(true);
    try {
      const userPhone = localStorage.getItem("userPhone");
      const response = await fetch(
        `${API_BASE_URL}/bookings/phone/${userPhone}`
      );

      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          fullName: editData.fullName,
          phone: editData.phone,
          address: editData.address,
          email: editData.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo(data.data);
        setIsEditing(false);
        showMessage("success", "Cập nhật thông tin thành công!");

        // Cập nhật localStorage
        localStorage.setItem("userName", data.data.fullName);
        localStorage.setItem("userPhone", data.data.phone);
        localStorage.setItem("userAddress", data.data.address);
      } else {
        showMessage("error", data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      showMessage("error", "Lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "Mật khẩu xác nhận không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage("error", "Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setSaving(true);
    try {
      // Verify current password by trying to login
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userInfo.username,
          password: passwordData.currentPassword,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginData.success) {
        showMessage("error", "Mật khẩu hiện tại không đúng!");
        setSaving(false);
        return;
      }

      // Update password
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          password: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", "Đổi mật khẩu thành công!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showMessage("error", data.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      showMessage("error", "Lỗi khi đổi mật khẩu");
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      confirmed: "info",
      processing: "primary",
      completed: "success",
      cancelled: "error",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        👤 Tài Khoản Của Tôi
      </Typography>

      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto 16px",
                  bgcolor: "#1976d2",
                  fontSize: 40,
                }}
              >
                {userInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {userInfo.fullName}
              </Typography>
              <Chip
                label={
                  userInfo.role === "admin" ? "Quản trị viên" : "Người dùng"
                }
                color={userInfo.role === "admin" ? "error" : "primary"}
                size="small"
              />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="caption" color="textSecondary">
                  Tham gia: {formatDate(userInfo.createdAt)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Card>
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab icon={<Person />} label="Thông tin cá nhân" />
              <Tab icon={<Lock />} label="Đổi mật khẩu" />
              <Tab icon={<ShoppingBag />} label="Đơn hàng của tôi" />
            </Tabs>

            <CardContent sx={{ p: 3 }}>
              {/* Tab 0: Profile Info */}
              {currentTab === 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">Thông tin cá nhân</Typography>
                    {!isEditing ? (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => {
                          setIsEditing(true);
                          setEditData(userInfo);
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={handleUpdateProfile}
                          disabled={saving}
                        >
                          Lưu
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => {
                            setIsEditing(false);
                            setEditData(userInfo);
                          }}
                          disabled={saving}
                        >
                          Hủy
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Tên đăng nhập"
                        fullWidth
                        value={userInfo.username}
                        disabled
                        InputProps={{
                          startAdornment: <AccountCircle sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        fullWidth
                        value={isEditing ? editData.email : userInfo.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Họ và tên"
                        fullWidth
                        value={
                          isEditing ? editData.fullName : userInfo.fullName
                        }
                        onChange={(e) =>
                          setEditData({ ...editData, fullName: e.target.value })
                        }
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Số điện thoại"
                        fullWidth
                        value={isEditing ? editData.phone : userInfo.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Địa chỉ"
                        fullWidth
                        multiline
                        rows={3}
                        value={isEditing ? editData.address : userInfo.address}
                        onChange={(e) =>
                          setEditData({ ...editData, address: e.target.value })
                        }
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Home sx={{ mr: 1, mt: 1 }} />,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />
                </Box>
              )}

              {/* Tab 1: Change Password */}
              {currentTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Đổi mật khẩu
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 3 }}
                  >
                    Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho
                    người khác
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Mật khẩu hiện tại"
                        type="password"
                        fullWidth
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        helperText="Tối thiểu 6 ký tự"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        fullWidth
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        error={
                          passwordData.confirmPassword &&
                          passwordData.newPassword !==
                            passwordData.confirmPassword
                        }
                        helperText={
                          passwordData.confirmPassword &&
                          passwordData.newPassword !==
                            passwordData.confirmPassword
                            ? "Mật khẩu xác nhận không khớp!"
                            : ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleChangePassword}
                        disabled={
                          saving ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword
                        }
                      >
                        {saving ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Đổi mật khẩu"
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Tab 2: Bookings */}
              {currentTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Đơn hàng của tôi ({bookings.length})
                  </Typography>

                  {loadingBookings ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : bookings.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <ShoppingBag
                        sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                      />
                      <Typography color="textSecondary">
                        Bạn chưa có đơn hàng nào
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                            <TableCell>
                              <strong>Mã đơn</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Dịch vụ</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Ngày đặt</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Trạng thái</strong>
                            </TableCell>
                            <TableCell align="center">
                              <strong>Chi tiết</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking._id} hover>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{ fontFamily: "monospace" }}
                                >
                                  #{booking._id.slice(-8)}
                                </Typography>
                              </TableCell>
                              <TableCell>{booking.service}</TableCell>
                              <TableCell>
                                {formatDate(booking.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusText(booking.status)}
                                  color={getStatusColor(booking.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setOpenBookingDialog(true);
                                  }}
                                >
                                  <Visibility />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Detail Dialog */}
      <Dialog
        open={openBookingDialog}
        onClose={() => setOpenBookingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          📋 Chi tiết đơn hàng
        </DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Mã đơn hàng:
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                  #{selectedBooking._id}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Dịch vụ:
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.service}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Trạng thái:
                </Typography>
                <Chip
                  label={getStatusText(selectedBooking.status)}
                  color={getStatusColor(selectedBooking.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày lấy đồ:
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.pickupDate
                    ? new Date(selectedBooking.pickupDate).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Chưa có"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày trả đồ:
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.deliveryDate
                    ? new Date(selectedBooking.deliveryDate).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Chưa có"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Địa chỉ:
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.address}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Bột giặt:
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.detergent}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Chất tẩy trắng:
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.bleach}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Túi giặt:
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.useBag}
                </Typography>
              </Grid>
              {selectedBooking.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ghi chú:
                  </Typography>
                  <Typography variant="body1">
                    {selectedBooking.notes}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày đặt:
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedBooking.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBookingDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
