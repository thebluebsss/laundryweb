import { useState, useEffect, useCallback } from "react";
import { bookingService } from "../../../services/api";
import { usePagination, useNotification } from "../../../hooks";

export const useOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [searchPhone, setSearchPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [dialogs, setDialogs] = useState({
    detail: false,
    payment: false,
    delete: false,
  });

  const { page, limit, totalPages, handlePageChange, updatePagination } =
    usePagination();
  const { showSuccess, showError } = useNotification();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await bookingService.getAllBookings({ page, limit });
      setOrders(result.bookings);
      setFilteredOrders(result.bookings);
      updatePagination(result.pagination);
    } catch (error) {
      showError(error.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [page, limit, updatePagination, showError]);

  const loadStats = useCallback(async () => {
    try {
      const result = await bookingService.getStats();
      setStats(result);
    } catch (error) {
      console.error("Lỗi thống kê:", error);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [loadOrders, loadStats]);

  const handleSearch = async () => {
    if (searchPhone.trim() === "") {
      loadOrders();
      return;
    }

    setLoading(true);
    try {
      const result = await bookingService.getBookingsByPhone(
        searchPhone.trim(),
      );
      setFilteredOrders(Array.isArray(result) ? result : []);
      handlePageChange(1);

      if (result.length === 0) {
        showError("Không tìm thấy đơn hàng nào");
      }
    } catch (error) {
      showError(error.message || "Lỗi khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchPhone("");
    handlePageChange(1);
    loadOrders();
    loadStats();
    showSuccess("Đã làm mới danh sách!");
  };

  const openDialog = (type, order = null) => {
    setDialogs((prev) => ({ ...prev, [type]: true }));
    if (order) {
      if (type === "delete") {
        setOrderToDelete(order);
      } else {
        setSelectedOrder(order);
      }
    }
  };

  const closeDialog = (type) => {
    setDialogs((prev) => ({ ...prev, [type]: false }));
    setSelectedOrder(null);
    setOrderToDelete(null);
  };

  const handleViewDetail = async (order) => {
    setLoading(true);
    try {
      const result = await bookingService.getBookingById(order._id);
      setSelectedOrder(result);
      openDialog("detail");
    } catch (error) {
      showError(error.message || "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const result = await bookingService.updateBookingStatus(
        selectedOrder._id,
        newStatus,
      );
      setSelectedOrder(result);
      loadOrders();
      loadStats();
      showSuccess("Đã cập nhật trạng thái đơn hàng!");
    } catch (error) {
      showError(error.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await bookingService.deleteBooking(orderToDelete._id);
      closeDialog("delete");
      loadOrders();
      loadStats();
      showSuccess("Đã xóa đơn hàng thành công!");
    } catch (error) {
      showError(error.message || "Không thể xóa đơn hàng");
    }
  };

  return {
    orders: filteredOrders,
    stats,
    searchPhone,
    loading,
    selectedOrder,
    orderToDelete,
    dialogs,
    page,
    totalPages,
    handlePageChange,
    setSearchPhone,
    handleSearch,
    handleRefresh,
    openDialog,
    closeDialog,
    handleViewDetail,
    handleUpdateStatus,
    handleDeleteOrder,
  };
};

export default useOrderManagement;
