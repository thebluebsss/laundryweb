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
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  LocalLaundryService,
  Build,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:3001/api";

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    working: 0,
    maintenance: 0,
    broken: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    type: "washing-machine",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    status: "working",
    location: "",
    notes: "",
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/equipment`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setEquipment(data.data);
        calculateStats(data.data);
      } else {
        setErrorMessage(data.message || "Không thể tải danh sách thiết bị");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const working = data.filter((e) => e.status === "working").length;
    const maintenance = data.filter((e) => e.status === "maintenance").length;
    const broken = data.filter((e) => e.status === "broken").length;
    setStats({ total, working, maintenance, broken });
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess("Thêm thiết bị thành công!");
        setOpenAddDialog(false);
        resetForm();
        loadEquipment();
      } else {
        setErrorMessage(data.message || "Không thể thêm thiết bị");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi khi thêm thiết bị");
    } finally {
      setLoading(false);
    }
  };

  const handleEditEquipment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/equipment/${selectedEquipment._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        showSuccess("Cập nhật thiết bị thành công!");
        setOpenEditDialog(false);
        resetForm();
        loadEquipment();
      } else {
        setErrorMessage(data.message || "Không thể cập nhật thiết bị");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi khi cập nhật thiết bị");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/equipment/${equipmentToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        showSuccess("Xóa thiết bị thành công!");
        setOpenDeleteDialog(false);
        setEquipmentToDelete(null);
        loadEquipment();
      } else {
        setErrorMessage(data.message || "Không thể xóa thiết bị");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage("Lỗi khi xóa thiết bị");
    }
  };

  const openEditDialogHandler = (item) => {
    setSelectedEquipment(item);
    setFormData({
      name: item.name,
      type: item.type,
      model: item.model,
      serialNumber: item.serialNumber,
      purchaseDate: item.purchaseDate ? item.purchaseDate.split("T")[0] : "",
      status: item.status,
      location: item.location,
      notes: item.notes || "",
    });
    setOpenEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "washing-machine",
      model: "",
      serialNumber: "",
      purchaseDate: "",
      status: "working",
      location: "",
      notes: "",
    });
    setSelectedEquipment(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "working":
        return "success";
      case "maintenance":
        return "warning";
      case "broken":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "working":
        return "Hoạt động";
      case "maintenance":
        return "Bảo trì";
      case "broken":
        return "Hỏng";
      default:
        return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "washing-machine":
        return "Máy giặt";
      case "dryer":
        return "Máy sấy";
      case "iron":
        return "Bàn ủi";
      case "other":
        return "Khác";
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN");
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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng thiết bị
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#e8f5e9" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckCircle sx={{ mr: 1, color: "#4caf50" }} />
                <Typography color="textSecondary">Hoạt động</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.working}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#fff3e0" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Warning sx={{ mr: 1, color: "#ff9800" }} />
                <Typography color="textSecondary">Bảo trì</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.maintenance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#ffebee" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ErrorIcon sx={{ mr: 1, color: "#f44336" }} />
                <Typography color="textSecondary">Hỏng</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.broken}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadEquipment}
          disabled={loading}
        >
          Làm mới
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={() => {
            resetForm();
            setOpenAddDialog(true);
          }}
        >
          Thêm thiết bị
        </Button>
      </Box>

      {/* Equipment Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            🔧 Danh sách thiết bị ({equipment.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Tên thiết bị</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Loại</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Model</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Số serial</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Vị trí</strong>
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
                  {equipment.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="textSecondary">
                          Chưa có thiết bị nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    equipment.map((item) => (
                      <TableRow key={item._id} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{getTypeText(item.type)}</TableCell>
                        <TableCell>{item.model}</TableCell>
                        <TableCell>{item.serialNumber}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(item.status)}
                            color={getStatusColor(item.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="warning"
                            onClick={() => openEditDialogHandler(item)}
                            title="Chỉnh sửa"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setEquipmentToDelete(item);
                              setOpenDeleteDialog(true);
                            }}
                            title="Xóa"
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
          )}
        </CardContent>
      </Card>

      {/* Add Equipment Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleAddEquipment}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            ➕ Thêm thiết bị mới
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Tên thiết bị"
              fullWidth
              margin="normal"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Loại thiết bị</InputLabel>
              <Select
                value={formData.type}
                label="Loại thiết bị"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <MenuItem value="washing-machine">Máy giặt</MenuItem>
                <MenuItem value="dryer">Máy sấy</MenuItem>
                <MenuItem value="iron">Bàn ủi</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Model"
              fullWidth
              margin="normal"
              required
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
            <TextField
              label="Số serial"
              fullWidth
              margin="normal"
              required
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: e.target.value })
              }
            />
            <TextField
              label="Ngày mua"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.purchaseDate}
              onChange={(e) =>
                setFormData({ ...formData, purchaseDate: e.target.value })
              }
            />
            <TextField
              label="Vị trí"
              fullWidth
              margin="normal"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="working">Hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="broken">Hỏng</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Ghi chú"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              Thêm
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Equipment Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleEditEquipment}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            ✏️ Chỉnh sửa thiết bị
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Tên thiết bị"
              fullWidth
              margin="normal"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Loại thiết bị</InputLabel>
              <Select
                value={formData.type}
                label="Loại thiết bị"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <MenuItem value="washing-machine">Máy giặt</MenuItem>
                <MenuItem value="dryer">Máy sấy</MenuItem>
                <MenuItem value="iron">Bàn ủi</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Model"
              fullWidth
              margin="normal"
              required
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
            <TextField
              label="Số serial"
              fullWidth
              margin="normal"
              required
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: e.target.value })
              }
            />
            <TextField
              label="Ngày mua"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.purchaseDate}
              onChange={(e) =>
                setFormData({ ...formData, purchaseDate: e.target.value })
              }
            />
            <TextField
              label="Vị trí"
              fullWidth
              margin="normal"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="working">Hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="broken">Hỏng</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Ghi chú"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={loading}
            >
              Cập nhật
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>⚠️ Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa thiết bị{" "}
            <strong>{equipmentToDelete?.name}</strong>?
          </Typography>
          <Typography color="error" sx={{ mt: 1 }}>
            Thao tác này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteEquipment}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
