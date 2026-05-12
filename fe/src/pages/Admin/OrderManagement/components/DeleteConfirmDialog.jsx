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
const DeleteConfirmDialog = ({ open, onClose, onConfirm, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>

      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa đơn hàng #
          {order._id?.substring(order._id.length - 6)}?
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
