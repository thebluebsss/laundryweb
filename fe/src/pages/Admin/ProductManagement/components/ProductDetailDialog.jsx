import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";

/**
 * Product Detail Dialog - Xem chi tiết sản phẩm
 */
const ProductDetailDialog = ({ open, onClose, product }) => {
  if (!product) return null;

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

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { label: "Hết hàng", color: "error" };
    } else if (stock < 10) {
      return { label: "Sắp hết", color: "warning" };
    } else {
      return { label: "Còn hàng", color: "success" };
    }
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        📦 Chi tiết sản phẩm
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Product Image */}
          {product.image && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                src={product.image}
                alt={product.name}
                variant="rounded"
                sx={{ width: 200, height: 200 }}
              >
                {product.name?.charAt(0)}
              </Avatar>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Tên sản phẩm:
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {product.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Mô tả:
              </Typography>
              <Typography variant="body1">
                {product.description || "Chưa có mô tả"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Danh mục:
              </Typography>
              <Typography variant="body1">{product.category}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Giá:
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={600}>
                {formatCurrency(product.price)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Tồn kho:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" fontWeight={600}>
                  {product.stock}
                </Typography>
                <Chip
                  label={stockStatus.label}
                  color={stockStatus.color}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Đã bán:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {product.sold || 0}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Ngày tạo:
              </Typography>
              <Typography variant="body2">
                {formatDate(product.createdAt)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Cập nhật lần cuối:
              </Typography>
              <Typography variant="body2">
                {formatDate(product.updatedAt)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailDialog;
