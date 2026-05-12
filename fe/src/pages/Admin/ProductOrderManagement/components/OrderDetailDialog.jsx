import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Chi tiết đơn hàng #{order._id?.substring(order._id.length - 6)}
      </DialogTitle>

      <DialogContent dividers>
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
                  <Typography>{order.customerInfo?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    SĐT:
                  </Typography>
                  <Typography>{order.customerInfo?.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email:
                  </Typography>
                  <Typography>{order.customerInfo?.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Địa chỉ:
                  </Typography>
                  <Typography>{order.customerInfo?.address}</Typography>
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
                {order.items?.map((item, index) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={`${formatCurrency(item.price)} x ${item.quantity}`}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </ListItem>
                    {index < order.items.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Tạm tính:</Typography>
                <Typography>
                  {formatCurrency(order.totalAmount - (order.shippingFee || 0))}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Phí vận chuyển:</Typography>
                <Typography>
                  {formatCurrency(order.shippingFee || 0)}
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
                  {formatCurrency(order.totalAmount)}
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
                  value={order.orderStatus}
                  label="Trạng thái đơn hàng"
                  onChange={(e) => onUpdateStatus(e.target.value)}
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
                  <Typography>{order.paymentMethod}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Trạng thái thanh toán:
                  </Typography>
                  <Chip
                    label={order.paymentStatus}
                    color={
                      order.paymentStatus === "paid" ? "success" : "warning"
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ngày đặt:
                  </Typography>
                  <Typography>{formatDate(order.createdAt)}</Typography>
                </Grid>
                {order.deliveredAt && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày giao:
                    </Typography>
                    <Typography>{formatDate(order.deliveredAt)}</Typography>
                  </Grid>
                )}
              </Grid>

              {order.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ghi chú:
                  </Typography>
                  <Typography>{order.notes}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;
