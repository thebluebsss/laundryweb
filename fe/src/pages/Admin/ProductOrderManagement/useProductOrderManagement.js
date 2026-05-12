import { useState, useEffect, useCallback } from "react";
import { orderService } from "../../../services/api";
import { usePagination, useNotification } from "../../../hooks";

/**
 * Custom hook for Product Order Management logic
 */
export const useProductOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [dialogs, setDialogs] = useState({
    view: false,
    payment: false,
  });

  const { page, limit, totalPages, handlePageChange, updatePagination } =
    usePagination();
  const { showSuccess, showError } = useNotification();

  // Load orders
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const result = await orderService.getAllOrders(params);
      setOrders(result.orders);
      updatePagination(result.pagination);
    } catch (error) {
      showError(error.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, updatePagination, showError]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const result = await orderService.getAllOrders({ limit: 1000 });
      const allOrders = result.orders || [];

      const stats = {
        total: allOrders.length,
        pending: allOrders.filter((o) => o.orderStatus === "pending").length,
        confirmed: allOrders.filter((o) => o.orderStatus === "confirmed")
          .length,
        shipped: allOrders.filter((o) => o.orderStatus === "shipped").length,
        delivered: allOrders.filter((o) => o.orderStatus === "delivered")
          .length,
        cancelled: allOrders.filter((o) => o.orderStatus === "cancelled")
          .length,
      };

      setStats(stats);
    } catch (error) {
      console.error("Lỗi thống kê:", error);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [loadOrders, loadStats]);

  // Search
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      loadOrders();
      return;
    }

    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.phone?.includes(searchTerm) ||
        order.customerInfo?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );

    setOrders(filtered);
  };

  // Refresh
  const handleRefresh = () => {
    setSearchTerm("");
    setStatusFilter("all");
    handlePageChange(1);
    loadOrders();
    loadStats();
    showSuccess("Đã làm mới danh sách!");
  };

  // Dialog handlers
  const openDialog = (type, order = null) => {
    setDialogs((prev) => ({ ...prev, [type]: true }));
    if (order) {
      setSelectedOrder(order);
    }
  };

  const closeDialog = (type) => {
    setDialogs((prev) => ({ ...prev, [type]: false }));
    setSelectedOrder(null);
  };

  // Update order status
  const handleUpdateStatus = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(selectedOrder._id, newStatus);
      showSuccess("Đã cập nhật trạng thái đơn hàng!");
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      loadOrders();
      loadStats();
    } catch (error) {
      showError(error.message || "Không thể cập nhật trạng thái");
    }
  };

  // Update payment status
  const handleUpdatePaymentStatus = async (
    paymentStatus,
    paymentDetails = {},
  ) => {
    try {
      await orderService.updatePaymentStatus(
        selectedOrder._id,
        paymentStatus,
        paymentDetails,
      );
      showSuccess("Đã cập nhật trạng thái thanh toán!");
      loadOrders();
      closeDialog("payment");
    } catch (error) {
      showError(error.message || "Không thể cập nhật trạng thái thanh toán");
    }
  };

  return {
    // Data
    orders,
    stats,
    searchTerm,
    statusFilter,
    loading,
    selectedOrder,
    dialogs,

    // Pagination
    page,
    totalPages,
    handlePageChange,

    // Actions
    setSearchTerm,
    setStatusFilter,
    handleSearch,
    handleRefresh,
    openDialog,
    closeDialog,
    handleUpdateStatus,
    handleUpdatePaymentStatus,
  };
};

export default useProductOrderManagement;
