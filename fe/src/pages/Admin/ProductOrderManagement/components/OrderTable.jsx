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
} from "@mui/material";
import { Visibility, Payment } from "@mui/icons-material";

/**
 * Order Table Component
 */
const OrderTable = ({ orders, onView, onUpdatePayment }) => {
  if (orders.length === 0) {
    return (
      <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
        Không có đơn hàng nào
      </Typography>
    );
  }

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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "failed":
        return "Thất bại";
      case "refunded":
        return "Đã hoàn tiền";
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
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <TableContainer component={Paper}>
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
          {orders.map((order) => (
            <TableRow key={order._id} hover>
              <TableCell>{order._id.substring(order._id.length - 6)}</TableCell>
              <TableCell>{order.customerInfo?.name || "N/A"}</TableCell>
              <TableCell>{order.customerInfo?.phone || "N/A"}</TableCell>
              <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                <Chip
                  label={getStatusText(order.orderStatus)}
                  color={getStatusColor(order.orderStatus)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={getPaymentStatusText(order.paymentStatus)}
                  color={getPaymentStatusColor(order.paymentStatus)}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() => onView(order)}
                  title="Xem chi tiết"
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  color="info"
                  onClick={() => onUpdatePayment(order)}
                  title="Cập nhật thanh toán"
                >
                  <Payment />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
