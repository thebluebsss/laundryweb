import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Collapse,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  LocalShipping,
  Receipt,
  Schedule,
} from "@mui/icons-material";
import PaymentStatusBadge from "./PaymentStatusBadge";
import config from "../config/api";

const UserOrderList = () => {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const bookingsResponse = await fetch(
        `${config.API_BASE_URL}/bookings/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const ordersResponse = await fetch(`${config.API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (bookingsResponse.ok) {
        const bookingsResult = await bookingsResponse.json();
        setBookings(bookingsResult.data?.bookings || []);
      }

      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        setOrders(ordersResult.data?.orders || []);
      }
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "success";
      case "confirmed":
      case "processing":
      case "shipped":
        return "primary";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const toggleExpand = (type, id) => {
    const key = `${type}_${id}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const allOrders = [
    ...bookings.map((booking) => ({ ...booking, type: "service" })),
    ...orders.map((order) => ({ ...order, type: "product" })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Đơn hàng của tôi
      </Typography>

      {allOrders.length === 0 ? (
        <Alert severity="info">
          Bạn chưa có đơn hàng nào. Hãy đặt dịch vụ hoặc mua sản phẩm để bắt
          đầu!
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {allOrders.map((item) => {
            const isExpanded = expandedItems[`${item.type}_${item._id}`];

            return (
              <Grid item xs={12} key={`${item.type}_${item._id}`}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {item.type === "service" ? (
                            <>
                              <LocalShipping
                                sx={{ mr: 1, verticalAlign: "middle" }}
                              />
                              Dịch vụ giặt là
                            </>
                          ) : (
                            <>
                              <Receipt
                                sx={{ mr: 1, verticalAlign: "middle" }}
                              />
                              Đơn hàng sản phẩm
                            </>
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mã đơn: {item._id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <Schedule
                            sx={{
                              fontSize: 16,
                              mr: 0.5,
                              verticalAlign: "middle",
                            }}
                          />
                          {formatDate(item.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {formatCurrency(item.totalAmount)}
                        </Typography>
                        <PaymentStatusBadge
                          status={item.paymentStatus}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Chip
                        label={
                          item.type === "service"
                            ? item.status
                            : item.orderStatus
                        }
                        color={getStatusColor(
                          item.type === "service"
                            ? item.status
                            : item.orderStatus,
                        )}
                        size="small"
                      />
                      <Chip
                        label={item.paymentMethod?.toUpperCase() || "COD"}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Button
                      onClick={() => toggleExpand(item.type, item._id)}
                      endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                      size="small"
                    >
                      {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                    </Button>

                    <Collapse in={isExpanded}>
                      <Divider sx={{ my: 2 }} />

                      {item.type === "service" ? (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Thông tin dịch vụ:
                          </Typography>
                          <Typography variant="body2">
                            Tên: {item.name}
                          </Typography>
                          <Typography variant="body2">
                            Điện thoại: {item.phone}
                          </Typography>
                          <Typography variant="body2">
                            Địa chỉ: {item.address}
                          </Typography>
                          <Typography variant="body2">
                            Dịch vụ: {item.service}
                          </Typography>
                          {item.notes && (
                            <Typography variant="body2">
                              Ghi chú: {item.notes}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Sản phẩm đã mua:
                          </Typography>
                          {item.items?.map((product, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2">
                                {product.name} x {product.quantity} ={" "}
                                {formatCurrency(
                                  product.price * product.quantity,
                                )}
                              </Typography>
                            </Box>
                          ))}
                          {item.shippingFee > 0 && (
                            <Typography variant="body2">
                              Phí vận chuyển: {formatCurrency(item.shippingFee)}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {item.paymentDetails?.transactionId && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Thông tin thanh toán:
                          </Typography>
                          <Typography variant="body2">
                            Mã giao dịch: {item.paymentDetails.transactionId}
                          </Typography>
                          {item.paymentDetails.paidAt && (
                            <Typography variant="body2">
                              Thời gian thanh toán:{" "}
                              {formatDate(item.paymentDetails.paidAt)}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default UserOrderList;
