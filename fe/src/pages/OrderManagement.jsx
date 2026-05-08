import React, { useState, useEffect } from "react";
import {
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
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  Delete,
  Refresh,
  Search,
  CheckCircle,
  HourglassEmpty,
  LocalShipping,
  Cancel,
  Payment,
} from "@mui/icons-material";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import PaymentStatusUpdater from "../components/PaymentStatusUpdater";
import config from "../config/api";
const API_BASE_URL = config.API_BASE_URL;

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const ordersPerPage = 10;

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [currentPage]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/bookings?page=${currentPage}&limit=${ordersPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        // Backend trả về { success, message, data: { bookings, pagination } }
        const { bookings, pagination } = data.data;
        setOrders(bookings);
        setFilteredOrders(bookings);
        setTotalPages(pagination.pages);
      } else {
        setErrorMessage("Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      setErrorMessage("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  const handleSearch = async () => {
    if (searchPhone.trim() === "") {
      loadOrders();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/phone/${searchPhone.trim()}`,
      );
      const data = await response.json();

      if (data.success) {
        setFilteredOrders(data.data);
        setCurrentPage(1);
        if (data.count === 0) {
          setErrorMessage("Không tìm thấy đơn hàng nào");
          setTimeout(() => setErrorMessage(""), 3000);
        }
      } else {
        setErrorMessage("Lỗi khi tìm kiếm");
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setErrorMessage("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchPhone("");
    setCurrentPage(1);
    loadOrders();
    loadStats();
    setSuccessMessage("Đã làm mới danh sách!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleViewDetail = async (order) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${order._id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedOrder(data.data);
        setOpenDetailDialog(true);
      } else {
        setErrorMessage("Không thể tải chi tiết đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${selectedOrder._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setSelectedOrder(data.data);
        loadOrders();
        loadStats();
        setSuccessMessage("Đã cập nhật trạng thái đơn hàng!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi kết nối đến server");
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${orderToDelete._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        setOpenDeleteDialog(false);
        setOrderToDelete(null);
        loadOrders();
        loadStats();
        setSuccessMessage("Đã xóa đơn hàng thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Không thể xóa đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi kết nối đến server");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
      case "processing":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Box sx={{ p: 3 }}>
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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Tìm kiếm theo số điện thoại"
              variant="outlined"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
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
              Tìm kiếm
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
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            📋 Danh sách đơn hàng ({filteredOrders.length})
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
                        <strong>Mã đơn</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Khách hàng</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Số điện thoại</strong>
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
                      <TableCell>
                        <strong>Thanh toán</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Thao tác</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography color="textSecondary">
                            Không có đơn hàng nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order._id} hover>
                          <TableCell>
                            {order._id.substring(order._id.length - 6)}
                          </TableCell>
                          <TableCell>{order.name}</TableCell>
                          <TableCell>{order.phone}</TableCell>
                          <TableCell>{order.service}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(order.status)}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <PaymentStatusBadge
                              status={order.paymentStatus}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewDetail(order)}
                              title="Xem chi tiết"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              color="info"
                              onClick={() => {
                                setSelectedOrder(order);
                                setOpenPaymentDialog(true);
                              }}
                              title="Cập nhật thanh toán"
                            >
                              <Payment />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setOrderToDelete(order);
                                setOpenDeleteDialog(true);
                              }}
                              title="Xóa đơn hàng"
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
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Chi tiết đơn hàng #
          {selectedOrder?._id?.substring(selectedOrder._id.length - 6)}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Khách hàng:
                </Typography>
                <Typography variant="body1">{selectedOrder.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Số điện thoại:
                </Typography>
                <Typography variant="body1">{selectedOrder.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Địa chỉ:
                </Typography>
                <Typography variant="body1">{selectedOrder.address}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Dịch vụ:
                </Typography>
                <Typography variant="body1">{selectedOrder.service}</Typography>
              </Box>
              {selectedOrder.notes && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ghi chú:
                  </Typography>
                  <Typography variant="body1">{selectedOrder.notes}</Typography>
                </Box>
              )}
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={selectedOrder.status}
                    label="Trạng thái"
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                  >
                    <MenuItem value="pending">Chờ xử lý</MenuItem>
                    <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                    <MenuItem value="processing">Đang xử lý</MenuItem>
                    <MenuItem value="completed">Hoàn thành</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa đơn hàng #
            {orderToDelete?._id?.substring(orderToDelete._id.length - 6)}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Status Update Dialog */}
      <PaymentStatusUpdater
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        booking={selectedOrder}
        onUpdate={(updatedOrder) => {
          setOrders(
            orders.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order,
            ),
          );
          setFilteredOrders(
            filteredOrders.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order,
            ),
          );
        }}
      />
    </Box>
  );
}
