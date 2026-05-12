import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

/**
 * Delete Confirm Dialog
 */
const DeleteConfirmDialog = ({ open, onClose, onConfirm, user }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>⚠️ Xác nhận xóa</DialogTitle>

      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa người dùng <strong>{user.fullName}</strong>{" "}
          ({user.username})?
        </Typography>
        <Typography color="error" sx={{ mt: 1 }}>
          Thao tác này không thể hoàn tác!
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
