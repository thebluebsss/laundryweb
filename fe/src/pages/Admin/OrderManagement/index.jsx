import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Pagination,
  Alert,
} from "@mui/material";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import OrderTable from "./components/OrderTable";
import OrderDetailDialog from "./components/OrderDetailDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import PaymentStatusUpdater from "../../../components/PaymentStatusUpdater";
import { useOrderManagement } from "./useOrderManagement";
import { useNotification } from "../../../hooks";

/**
 * Order Management Page - Admin
 * Quản lý đơn hàng dịch vụ giặt là
 */
const OrderManagement = () => {
  const {
    orders,
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
  } = useOrderManagement();

  const { notification, hideNotification } = useNotification();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Notifications */}
      {notification.open && (
        <Alert
          severity={notification.severity}
          sx={{ mb: 2 }}
          onClose={hideNotification}
        >
          {notification.message}
        </Alert>
      )}

      {/* Page Title */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        🧺 Quản lý đơn hàng dịch vụ
      </Typography>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Search Bar */}
      <SearchBar
        searchPhone={searchPhone}
        onSearchChange={setSearchPhone}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Order Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            📋 Danh sách đơn hàng ({orders.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <OrderTable
                orders={orders}
                onView={handleViewDetail}
                onDelete={(order) => openDialog("delete", order)}
                onUpdatePayment={(order) => openDialog("payment", order)}
              />

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, newPage) => handlePageChange(newPage)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={dialogs.detail}
        onClose={() => closeDialog("detail")}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Payment Status Update Dialog */}
      <PaymentStatusUpdater
        open={dialogs.payment}
        onClose={() => closeDialog("payment")}
        booking={selectedOrder}
        onUpdate={(updatedOrder) => {
          setSelectedOrder(updatedOrder);
          // Reload orders to reflect changes
          handleRefresh();
        }}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={dialogs.delete}
        onClose={() => closeDialog("delete")}
        onConfirm={handleDeleteOrder}
        order={orderToDelete}
      />
    </Container>
  );
};

export default OrderManagement;
