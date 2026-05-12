import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

/**
 * Order Detail Dialog
 */
const OrderDetailDialog = ({ open, onClose, order, onUpdateStatus }) => {
  if (!order) return null;

  const handleStatusChange = (e) => {
    onUpdateStatus(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Chi tiết đơn hàng #{order._id?.substring(order._id.length - 6)}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Khách hàng:
            </Typography>
            <Typography variant="body1">{order.name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Số điện thoại:
            </Typography>
            <Typography variant="body1">{order.phone}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Địa chỉ:
            </Typography>
            <Typography variant="body1">{order.address}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Dịch vụ:
            </Typography>
            <Typography variant="body1">{order.service}</Typography>
          </Box>

          {order.notes && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Ghi chú:
              </Typography>
              <Typography variant="body1">{order.notes}</Typography>
            </Box>
          )}

          <Box>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={order.status}
                label="Trạng thái"
                onChange={handleStatusChange}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;
