import { useState, useEffect, useCallback } from "react";
import { userService } from "../../../services/api";
import { usePagination, useNotification } from "../../../hooks";

/**
 * Custom hook for User Management logic
 */
export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    users: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Dialogs state
  const [dialogs, setDialogs] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });

  const { page, limit, totalPages, handlePageChange, updatePagination } =
    usePagination();
  const { showSuccess, showError } = useNotification();

  // Load users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await userService.getUsers({
        page,
        limit,
        search: searchTerm,
      });

      setUsers(result.users);
      updatePagination(result.pagination);
    } catch (error) {
      showError(error.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, updatePagination, showError]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const result = await userService.getStats();
      setStats(result);
    } catch (error) {
      console.error("Lỗi thống kê:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadUsers();
    loadStats();
  }, [loadUsers, loadStats]);

  // Search
  const handleSearch = () => {
    handlePageChange(1);
    loadUsers();
  };

  // Refresh
  const handleRefresh = () => {
    setSearchTerm("");
    handlePageChange(1);
    loadUsers();
    loadStats();
    showSuccess("Đã làm mới danh sách!");
  };

  // Dialog handlers
  const openDialog = (type, user = null) => {
    setDialogs((prev) => ({ ...prev, [type]: true }));
    if (user) {
      if (type === "delete") {
        setUserToDelete(user);
      } else {
        setSelectedUser(user);
      }
    }
  };

  const closeDialog = (type) => {
    setDialogs((prev) => ({ ...prev, [type]: false }));
    setSelectedUser(null);
    setUserToDelete(null);
  };

  // Add user
  const handleAddUser = async (userData) => {
    setLoading(true);
    try {
      await userService.createUser(userData);
      showSuccess("Thêm người dùng thành công!");
      closeDialog("add");
      loadUsers();
      loadStats();
    } catch (error) {
      showError(error.message || "Không thể thêm người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Edit user
  const handleEditUser = async (userData) => {
    setLoading(true);
    try {
      // Remove password if empty
      const updateData = { ...userData };
      if (!updateData.password) {
        delete updateData.password;
      }

      await userService.updateUser(selectedUser._id, updateData);
      showSuccess("Cập nhật người dùng thành công!");
      closeDialog("edit");
      loadUsers();
    } catch (error) {
      showError(error.message || "Không thể cập nhật người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(userToDelete._id);
      showSuccess("Xóa người dùng thành công!");
      closeDialog("delete");
      loadUsers();
      loadStats();
    } catch (error) {
      showError(error.message || "Không thể xóa người dùng");
    }
  };

  // Toggle active status
  const handleToggleActive = async (user) => {
    try {
      await userService.toggleUserActive(user._id);
      showSuccess("Cập nhật trạng thái thành công!");
      loadUsers();
      loadStats();
    } catch (error) {
      showError(error.message || "Không thể cập nhật trạng thái");
    }
  };

  return {
    // Data
    users,
    stats,
    searchTerm,
    loading,
    selectedUser,
    userToDelete,
    dialogs,

    // Pagination
    page,
    totalPages,
    handlePageChange,

    // Actions
    setSearchTerm,
    handleSearch,
    handleRefresh,
    openDialog,
    closeDialog,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleToggleActive,
  };
};

export default useUserManagement;
