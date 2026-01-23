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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
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
  ShoppingCart,
  Inventory,
} from "@mui/icons-material";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import PaymentStatusUpdater from "../components/PaymentStatusUpdater";
import config from "../config/api";

const API_BASE_URL = config.API_BASE_URL;

export default function ProductOrderManagement() {
  console.log("🛒 ProductOrderManagement component loaded");

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  const ordersPerPage = 10;

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [currentPage, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/admin/orders?page=${currentPage}&limit=${ordersPerPage}`;
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }

      console.log("🔍 Fetching orders from:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("📋 Orders data:", data);

      if (data.success) {
        setOrders(data.data);
        setFilteredOrders(data.data);
        setTotalPages(data.pagination.totalPages);
        console.log("✅ Loaded", data.data.length, "orders");
      } else {
        setErrorMessage("Không thể tải danh sách đơn hàng: " + data.message);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải đơn hàng:", error);
      setErrorMessage("Lỗi kết nối đến server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log("📊 Loading stats...");

      // Since we don't have a specific stats endpoint for orders, we'll calculate from the data
      const response = await fetch(`${API_BASE_URL}/admin/orders?limit=1000`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const allOrders = data.data;
          const stats = {
            total: allOrders.length,
            pending: allOrders.filter((o) => o.orderStatus === "pending")
              .length,
            confirmed: allOrders.filter((o) => o.orderStatus === "confirmed")
              .length,
            shipped: allOrders.filter((o) => o.orderStatus === "shipped")
              .length,
            delivered: allOrders.filter((o) => o.orderStatus === "delivered")
              .length,
            cancelled: allOrders.filter((o) => o.orderStatus === "cancelled")
              .length,
          };
          console.log("📊 Stats:", stats);
          setStats(stats);
        }
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải thống kê:", error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customerInfo.phone.includes(searchTerm) ||
        order.customerInfo.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );

    setFilteredOrders(filtered);
    if (filtered.length === 0) {
      setErrorMessage("Không tìm thấy đơn hàng nào");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    loadOrders();
    loadStats();
    setSuccessMessage("Đã làm mới danh sách!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleViewDetail = async (order) => {
    setLoading(true);
    try {
      console.log("👁️ Viewing order details:", order._id);

      const response = await fetch(`${API_BASE_URL}/orders/${order._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSelectedOrder(data.data);
        setOpenDetailDialog(true);
        console.log("✅ Order details loaded");
      } else {
        setErrorMessage("Không thể tải chi tiết đơn hàng: " + data.message);
      }
    } catch (error) {
      console.error("❌ Lỗi:", error);
      setErrorMessage("Lỗi kết nối đến server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${selectedOrder._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ orderStatus: newStatus }),
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

  const handleUpdatePaymentStatus = async (paymentStatus, paymentDetails) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${selectedOrder._id}/payment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ paymentStatus, paymentDetails }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setSelectedOrder(data.data);
        loadOrders();
        setSuccessMessage("Đã cập nhật trạng thái thanh toán!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Không thể cập nhật trạng thái thanh toán");
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
      case "shipped":
        return "primary";
      case "delivered":
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
      case "shipped":
        return "Đã giao vận";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
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

      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        🛒 Quản lý đơn hàng sản phẩm
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ShoppingCart sx={{ mr: 1, color: "#1976d2" }} />
                <Typography color="textSecondary">Tổng đơn hàng</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.total}
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
                {stats.pending}
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
                {stats.confirmed}
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
                {stats.shipped}
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
                {stats.delivered}
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
                {stats.cancelled}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Tìm kiếm (Mã đơn, tên, SĐT, email)"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              sx={{ flexGrow: 1, minWidth: 300 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xử lý</MenuItem>
                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="processing">Đang xử lý</MenuItem>
                <MenuItem value="shipped">Đã giao vận</MenuItem>
                <MenuItem value="delivered">Đã giao hàng</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
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

      {/* Orders Table */}
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
                        <strong>Tổng tiền</strong>
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
                          <TableCell>{order.customerInfo.name}</TableCell>
                          <TableCell>{order.customerInfo.phone}</TableCell>
                          <TableCell>
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(order.orderStatus)}
                              color={getStatusColor(order.orderStatus)}
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

      {/* Order Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Chi tiết đơn hàng #
          {selectedOrder?._id?.substring(selectedOrder._id.length - 6)}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Customer Info */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    👤 Thông tin khách hàng
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Tên:
                      </Typography>
                      <Typography>{selectedOrder.customerInfo.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        SĐT:
                      </Typography>
                      <Typography>
                        {selectedOrder.customerInfo.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Email:
                      </Typography>
                      <Typography>
                        {selectedOrder.customerInfo.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Địa chỉ:
                      </Typography>
                      <Typography>
                        {selectedOrder.customerInfo.address}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🛍️ Sản phẩm đã đặt
                  </Typography>
                  <List>
                    {selectedOrder.items.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.light" }}>
                              {item.name[0]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.name}
                            secondary={`${formatCurrency(item.price)} x ${item.quantity}`}
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                        </ListItem>
                        {index < selectedOrder.items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>Tạm tính:</Typography>
                    <Typography>
                      {formatCurrency(
                        selectedOrder.totalAmount - selectedOrder.shippingFee,
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>Phí vận chuyển:</Typography>
                    <Typography>
                      {formatCurrency(selectedOrder.shippingFee)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                    }}
                  >
                    <Typography variant="h6">Tổng cộng:</Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📦 Trạng thái đơn hàng
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Trạng thái đơn hàng</InputLabel>
                    <Select
                      value={selectedOrder.orderStatus}
                      label="Trạng thái đơn hàng"
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                    >
                      <MenuItem value="pending">Chờ xử lý</MenuItem>
                      <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                      <MenuItem value="processing">Đang xử lý</MenuItem>
                      <MenuItem value="shipped">Đã giao vận</MenuItem>
                      <MenuItem value="delivered">Đã giao hàng</MenuItem>
                      <MenuItem value="cancelled">Đã hủy</MenuItem>
                    </Select>
                  </FormControl>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Phương thức thanh toán:
                      </Typography>
                      <Typography>{selectedOrder.paymentMethod}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Trạng thái thanh toán:
                      </Typography>
                      <PaymentStatusBadge
                        status={selectedOrder.paymentStatus}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ngày đặt:
                      </Typography>
                      <Typography>
                        {formatDate(selectedOrder.createdAt)}
                      </Typography>
                    </Grid>
                    {selectedOrder.deliveredAt && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Ngày giao:
                        </Typography>
                        <Typography>
                          {formatDate(selectedOrder.deliveredAt)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {selectedOrder.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ghi chú:
                      </Typography>
                      <Typography>{selectedOrder.notes}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Status Update Dialog */}
      <PaymentStatusUpdater
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        booking={selectedOrder}
        isOrder={true} // Flag to indicate this is for orders, not bookings
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
          setSelectedOrder(updatedOrder);
        }}
      />
    </Box>
  );
}
