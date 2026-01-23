import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  TextField,
} from "@mui/material";
import PaymentStatusBadge from "./PaymentStatusBadge";
import config from "../config/api";

const PaymentStatusUpdater = ({
  open,
  onClose,
  booking,
  isOrder = false,
  onUpdate,
}) => {
  const [newStatus, setNewStatus] = useState(
    booking?.paymentStatus || "unpaid",
  );
  const [transactionId, setTransactionId] = useState(
    booking?.paymentDetails?.transactionId || "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const paymentStatuses = [
    { value: "unpaid", label: "Chưa thanh toán" },
    { value: "pending", label: "Đang xử lý" },
    { value: "paid", label: "Đã thanh toán" },
    { value: "failed", label: "Thất bại" },
    { value: "refunded", label: "Đã hoàn tiền" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    try {
      const updateData = {
        paymentStatus: newStatus,
      };

      // Nếu cập nhật thành "paid" và có transaction ID
      if (newStatus === "paid" && transactionId) {
        updateData.paymentDetails = {
          ...booking.paymentDetails,
          transactionId,
          paidAt: new Date().toISOString(),
        };
      }

      // Determine the correct API endpoint
      const endpoint = isOrder
        ? `${config.API_BASE_URL}/orders/${booking._id}/payment-status`
        : `${config.API_BASE_URL}/bookings/${booking._id}/payment-status`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        onUpdate(result.data);
        onClose();
      } else {
        setError(result.message || "Không thể cập nhật trạng thái thanh toán");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Cập nhật trạng thái thanh toán
        <Typography variant="body2" color="text.secondary">
          {isOrder ? "Đơn hàng" : "Booking"}: {booking?._id}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Trạng thái hiện tại:
          </Typography>
          <PaymentStatusBadge status={booking?.paymentStatus} />
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Trạng thái mới</InputLabel>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            label="Trạng thái mới"
          >
            {paymentStatuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {newStatus === "paid" && (
          <TextField
            fullWidth
            label="Mã giao dịch (Transaction ID)"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Nhập mã giao dịch từ ngân hàng"
            sx={{ mb: 2 }}
          />
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Thông tin thanh toán:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phương thức: {booking?.paymentMethod?.toUpperCase() || "COD"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Số tiền:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(booking?.totalAmount || 0)}
          </Typography>
          {booking?.paymentDetails?.transactionId && (
            <Typography variant="body2" color="text.secondary">
              Mã GD hiện tại: {booking.paymentDetails.transactionId}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info">
          Lưu ý: Việc cập nhật trạng thái thanh toán sẽ ảnh hưởng đến quy trình
          xử lý đơn hàng.
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading || newStatus === booking?.paymentStatus}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentStatusUpdater;
