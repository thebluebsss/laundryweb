import { Typography, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CircularProgress,
  Pagination,
  Alert,
} from "@mui/material";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";
import ProductFormDialog from "./components/ProductFormDialog";
import ProductDetailDialog from "./components/ProductDetailDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { useProductManagement } from "./useProductManagement";
import { useNotification } from "../../../hooks";

/**
 * Product Management Page - Admin
 * Quản lý sản phẩm
 */
const ProductManagement = () => {
  const {
    products,
    stats,
    searchTerm,
    loading,
    selectedProduct,
    productToDelete,
    dialogs,
    page,
    totalPages,
    handlePageChange,
    setSearchTerm,
    handleSearch,
    handleRefresh,
    openDialog,
    closeDialog,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
  } = useProductManagement();

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
        Quản lý sản phẩm
      </Typography>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onAddNew={() => openDialog("add")}
        loading={loading}
      />

      {/* Product Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            📋 Danh sách sản phẩm ({products.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <ProductTable
                products={products}
                onView={(product) => openDialog("view", product)}
                onEdit={(product) => openDialog("edit", product)}
                onDelete={(product) => openDialog("delete", product)}
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

      {/* Add Product Dialog */}
      <ProductFormDialog
        open={dialogs.add}
        onClose={() => closeDialog("add")}
        onSubmit={handleAddProduct}
        loading={loading}
      />

      {/* Edit Product Dialog */}
      <ProductFormDialog
        open={dialogs.edit}
        onClose={() => closeDialog("edit")}
        onSubmit={handleEditProduct}
        product={selectedProduct}
        loading={loading}
      />

      {/* View Product Dialog */}
      <ProductDetailDialog
        open={dialogs.view}
        onClose={() => closeDialog("view")}
        product={selectedProduct}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={dialogs.delete}
        onClose={() => closeDialog("delete")}
        onConfirm={handleDeleteProduct}
        product={productToDelete}
      />
    </Box>
  );
};

export default ProductManagement;
