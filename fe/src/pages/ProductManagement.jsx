import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Alert,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Inventory2,
  RemoveCircle,
  AddCircle,
} from "@mui/icons-material";

const categories = [
  { value: "detergent", label: "Bột/Nước giặt" },
  { value: "softener", label: "Nước xả vải" },
  { value: "bleach", label: "Chất tẩy" },
  { value: "bag", label: "Túi giặt" },
  { value: "accessory", label: "Phụ kiện" },
];

const recommendForOptions = [
  { value: "all", label: "Tất cả dịch vụ" },
  { value: "Giặt hấp/sấy khô", label: "Giặt hấp/sấy khô" },
  { value: "Giặt ủi", label: "Giặt ủi" },
  { value: "Giặt khô (Dry Clean)", label: "Giặt khô" },
];

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [stockAction, setStockAction] = useState({
    id: null,
    quantity: 0,
    action: "add",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "detergent",
    image: "",
    stock: "",
    unit: "",
    weight: "",
    brand: "",
    rating: 5,
    tags: "",
    recommendFor: ["all"],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://laundryweb-b74z.onrender.com/api/products"
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      showAlert("Lỗi khi tải sản phẩm", "error");
    }
  };

  const showAlert = (message, severity = "success") => {
    setAlert({ show: true, message, severity });
    setTimeout(
      () => setAlert({ show: false, message: "", severity: "success" }),
      3000
    );
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || "",
        category: product.category,
        image: product.image || "",
        stock: product.stock,
        unit: product.unit,
        weight: product.weight || "",
        brand: product.brand || "",
        rating: product.rating || 5,
        tags: product.tags?.join(", ") || "",
        recommendFor: product.recommendFor || ["all"],
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "detergent",
        image: "",
        stock: "",
        unit: "",
        weight: "",
        brand: "",
        rating: 5,
        tags: "",
        recommendFor: ["all"],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : null,
        stock: Number(formData.stock),
        rating: Number(formData.rating),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const url = currentProduct
        ? `https://laundryweb-b74z.onrender.com/api/products/${currentProduct._id}`
        : "https://laundryweb-b74z.onrender.com/api/products";

      const method = currentProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (data.success) {
        showAlert(
          currentProduct
            ? "Cập nhật sản phẩm thành công"
            : "Thêm sản phẩm thành công"
        );
        fetchProducts();
        handleCloseDialog();
      } else {
        showAlert(data.message || "Có lỗi xảy ra", "error");
      }
    } catch (error) {
      showAlert("Lỗi khi lưu sản phẩm", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://laundryweb-b74z.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        showAlert("Xóa sản phẩm thành công");
        fetchProducts();
      }
    } catch (error) {
      showAlert("Lỗi khi xóa sản phẩm", "error");
    }
  };

  const handleOpenStockDialog = (product) => {
    setStockAction({ id: product._id, quantity: 0, action: "add" });
    setOpenStockDialog(true);
  };

  const handleUpdateStock = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://laundryweb-b74z.onrender.com/api/products/${stockAction.id}/stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: Number(stockAction.quantity),
            action: stockAction.action,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showAlert("Cập nhật tồn kho thành công");
        fetchProducts();
        setOpenStockDialog(false);
      } else {
        showAlert(data.message || "Có lỗi xảy ra", "error");
      }
    } catch (error) {
      showAlert("Lỗi khi cập nhật tồn kho", "error");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Box sx={{ p: 3 }}>
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý sản phẩm ({products.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
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
                <strong>Đánh giá</strong>
              </TableCell>
              <TableCell>
                <strong>Đã bán</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Thao tác</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {product.brand}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      categories.find((c) => c.value === product.category)
                        ?.label
                    }
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {formatPrice(product.price)}
                  </Typography>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <Typography
                        variant="caption"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                        }}
                      >
                        {formatPrice(product.originalPrice)}
                      </Typography>
                    )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${product.stock} ${product.unit}`}
                    size="small"
                    color={product.stock < 10 ? "error" : "success"}
                    icon={<Inventory2 />}
                  />
                </TableCell>
                <TableCell>⭐ {product.rating}</TableCell>
                <TableCell>{product.soldCount || 0}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => handleOpenStockDialog(product)}
                    title="Cập nhật tồn kho"
                  >
                    <Inventory2 />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog thêm/sửa sản phẩm */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={formData.category}
                  label="Danh mục"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Thương hiệu"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Giá bán"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Giá gốc (nếu có)"
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Tồn kho"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Đơn vị"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Khối lượng"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL hình ảnh"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Đánh giá (1-5)"
                type="number"
                inputProps={{ min: 1, max: 5, step: 0.1 }}
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tags (phân cách bằng dấu phẩy)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="bột giặt, omo, máy giặt"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Gợi ý cho dịch vụ</InputLabel>
                <Select
                  multiple
                  value={formData.recommendFor}
                  label="Gợi ý cho dịch vụ"
                  onChange={(e) =>
                    setFormData({ ...formData, recommendFor: e.target.value })
                  }
                >
                  {recommendForOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentProduct ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog cập nhật tồn kho */}
      <Dialog open={openStockDialog} onClose={() => setOpenStockDialog(false)}>
        <DialogTitle>Cập nhật tồn kho</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Hành động</InputLabel>
              <Select
                value={stockAction.action}
                label="Hành động"
                onChange={(e) =>
                  setStockAction({ ...stockAction, action: e.target.value })
                }
              >
                <MenuItem value="add">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AddCircle color="success" /> Nhập thêm
                  </Box>
                </MenuItem>
                <MenuItem value="subtract">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RemoveCircle color="error" /> Xuất bớt
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Số lượng"
              type="number"
              value={stockAction.quantity}
              onChange={(e) =>
                setStockAction({ ...stockAction, quantity: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStockDialog(false)}>Hủy</Button>
          <Button onClick={handleUpdateStock} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
