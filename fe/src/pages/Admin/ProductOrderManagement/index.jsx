import {
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
import { useProductOrderManagement } from "./useProductOrderManagement";
import { useNotification } from "../../../hooks";

/**
 * Product Order Management Page - Admin
 * Quản lý đơn hàng sản phẩm
 */
const ProductOrderManagement = () => {
  const {
    orders,
    stats,
    searchTerm,
    statusFilter,
    loading,
    selectedOrder,
    dialogs,
    page,
    totalPages,
    handlePageChange,
    setSearchTerm,
    setStatusFilter,
    handleSearch,
    handleRefresh,
    openDialog,
    closeDialog,
    handleUpdateStatus,
  } = useProductOrderManagement();

  const { notification, hideNotification } = useNotification();

  return (
    <Box>
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
        🛒 Quản lý đơn hàng sản phẩm
      </Typography>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
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
                onView={(order) => openDialog("view", order)}
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
        open={dialogs.view}
        onClose={() => closeDialog("view")}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </Box>
  );
};

export default ProductOrderManagement;
