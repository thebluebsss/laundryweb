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
import { Visibility, Delete, Payment } from "@mui/icons-material";
import PaymentStatusBadge from "../../../../components/PaymentStatusBadge";

/**
 * Order Table Component
 */
const OrderTable = ({ orders, onView, onDelete, onUpdatePayment }) => {
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
          {orders.map((order) => (
            <TableRow key={order._id} hover>
              <TableCell>{order._id.substring(order._id.length - 6)}</TableCell>
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
                <PaymentStatusBadge status={order.paymentStatus} size="small" />
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
                <IconButton
                  color="error"
                  onClick={() => onDelete(order)}
                  title="Xóa đơn hàng"
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

export default OrderTable;
