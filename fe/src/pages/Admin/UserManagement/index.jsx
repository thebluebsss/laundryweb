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
import UserTable from "./components/UserTable";
import UserFormDialog from "./components/UserFormDialog";
import UserDetailDialog from "./components/UserDetailDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { useUserManagement } from "./useUserManagement";
import { useNotification } from "../../../hooks";

/**
 * User Management Page - Admin
 * Quản lý người dùng
 */
const UserManagement = () => {
  const {
    users,
    stats,
    searchTerm,
    loading,
    selectedUser,
    userToDelete,
    dialogs,
    page,
    totalPages,
    handlePageChange,
    setSearchTerm,
    handleSearch,
    handleRefresh,
    openDialog,
    closeDialog,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleToggleActive,
  } = useUserManagement();

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
        👥 Quản lý người dùng
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

      {/* User Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            📋 Danh sách người dùng ({users.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <UserTable
                users={users}
                onView={(user) => openDialog("view", user)}
                onEdit={(user) => openDialog("edit", user)}
                onDelete={(user) => openDialog("delete", user)}
                onToggleActive={handleToggleActive}
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

      {/* Add User Dialog */}
      <UserFormDialog
        open={dialogs.add}
        onClose={() => closeDialog("add")}
        onSubmit={handleAddUser}
        loading={loading}
      />

      {/* Edit User Dialog */}
      <UserFormDialog
        open={dialogs.edit}
        onClose={() => closeDialog("edit")}
        onSubmit={handleEditUser}
        user={selectedUser}
        loading={loading}
      />

      {/* View User Dialog */}
      <UserDetailDialog
        open={dialogs.view}
        onClose={() => closeDialog("view")}
        user={selectedUser}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={dialogs.delete}
        onClose={() => closeDialog("delete")}
        onConfirm={handleDeleteUser}
        user={userToDelete}
      />
    </Container>
  );
};

export default UserManagement;
