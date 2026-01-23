import { Chip } from "@mui/material";
import {
  CheckCircle,
  Schedule,
  Cancel,
  Error,
  Refresh,
  Block,
} from "@mui/icons-material";

const PaymentStatusBadge = ({ status, size = "medium" }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          label: "Đã thanh toán",
          color: "success",
          icon: <CheckCircle />,
        };
      case "unpaid":
        return {
          label: "Chưa thanh toán",
          color: "default",
          icon: <Schedule />,
        };
      case "pending":
        return {
          label: "Đang xử lý",
          color: "warning",
          icon: <Schedule />,
        };
      case "failed":
        return {
          label: "Thất bại",
          color: "error",
          icon: <Error />,
        };
      case "refunded":
        return {
          label: "Đã hoàn tiền",
          color: "info",
          icon: <Refresh />,
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "default",
          icon: <Block />,
        };
      default:
        return {
          label: "Không xác định",
          color: "default",
          icon: <Cancel />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      icon={config.icon}
      variant="filled"
      sx={{
        fontWeight: 600,
        "& .MuiChip-icon": {
          fontSize: size === "small" ? "16px" : "18px",
        },
      }}
    />
  );
};

export default PaymentStatusBadge;
