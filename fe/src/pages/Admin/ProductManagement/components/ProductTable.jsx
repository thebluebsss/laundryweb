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
  Avatar,
  Box,
} from "@mui/material";
import { Visibility, Delete, Edit } from "@mui/icons-material";

const ProductTable = ({ products, onView, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
        Không có sản phẩm nào
      </Typography>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell>
              <strong>Hình ảnh</strong>
            </TableCell>
            <TableCell>
              <strong>Tên sản phẩm</strong>
            </TableCell>
            <TableCell>
              <strong>Danh mục</strong>
            </TableCell>
            <TableCell>
              <strong>Giá</strong>
            </TableCell>
            <TableCell>
              <strong>Tồn kho</strong>
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
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);

            return (
              <TableRow key={product._id} hover>
                <TableCell>
                  <Avatar
                    src={product.image}
                    alt={product.name}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  >
                    {product.name?.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.description?.substring(0, 50)}...
                  </Typography>
                </TableCell>
                <TableCell>{product.category || "N/A"}</TableCell>
                <TableCell>
                  <Typography fontWeight={600}>
                    {formatCurrency(product.price)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {product.stock}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Đã bán: {product.sold || 0}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={stockStatus.label}
                    color={stockStatus.color}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => onView(product)}
                    title="Xem chi tiết"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="warning"
                    onClick={() => onEdit(product)}
                    title="Chỉnh sửa"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(product)}
                    title="Xóa"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
