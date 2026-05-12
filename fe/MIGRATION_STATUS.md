# Frontend Migration Status

## ✅ Đã hoàn thành

### 1. Service Layer (100%)

- ✅ `services/api/client.js` - Base API client
- ✅ `services/api/authService.js` - Authentication
- ✅ `services/api/bookingService.js` - Booking management
- ✅ `services/api/orderService.js` - Order management
- ✅ `services/api/userService.js` - User management
- ✅ `services/api/productService.js` - Product management

### 2. Custom Hooks (100%)

- ✅ `hooks/useAuth.js` - Authentication logic
- ✅ `hooks/useApi.js` - Generic API calls
- ✅ `hooks/usePagination.js` - Pagination logic
- ✅ `hooks/useNotification.js` - Notification management

### 3. Pages Migrated

#### Auth Pages (100%)

- ✅ `pages/Auth/Login/` - Login & Register page
  - ✅ `components/LoginForm.jsx`
  - ✅ `components/RegisterForm.jsx`
  - ✅ `useLogin.js`
  - ✅ `index.jsx`

#### Admin Pages (50%)

- ✅ `pages/Admin/UserManagement/` - User management (HOÀN THÀNH)
  - ✅ `components/StatsCards.jsx`
  - ✅ `components/SearchBar.jsx`
  - ✅ `components/UserTable.jsx`
  - ✅ `components/UserFormDialog.jsx`
  - ✅ `components/UserDetailDialog.jsx`
  - ✅ `components/DeleteConfirmDialog.jsx`
  - ✅ `useUserManagement.js`
  - ✅ `index.jsx`

- 🔄 `pages/Admin/OrderManagement/` - Booking management (ĐANG LÀM)
  - ✅ `components/StatsCards.jsx`
  - ⏳ `components/SearchBar.jsx`
  - ⏳ `components/OrderTable.jsx`
  - ⏳ `components/OrderDetailDialog.jsx`
  - ⏳ `useOrderManagement.js`
  - ⏳ `index.jsx`

- ⏳ `pages/Admin/ProductOrderManagement/` - Product order management
- ⏳ `pages/Admin/ProductManagement/` - Product management
- ⏳ `pages/Admin/EquipmentManagement/` - Equipment management
- ⏳ `pages/Admin/Dashboard/` - Admin dashboard

## 📋 Pattern để migrate các trang còn lại

### Cấu trúc chuẩn cho mỗi trang:

```
PageName/
├── components/
│   ├── StatsCards.jsx          # Thống kê (nếu có)
│   ├── SearchBar.jsx           # Thanh tìm kiếm
│   ├── DataTable.jsx           # Bảng dữ liệu
│   ├── FormDialog.jsx          # Form thêm/sửa
│   ├── DetailDialog.jsx        # Xem chi tiết
│   └── DeleteConfirmDialog.jsx # Xác nhận xóa
├── usePageName.js              # Custom hook chứa logic
└── index.jsx                   # Main component
```

### Template cho usePageName.js:

```javascript
import { useState, useEffect, useCallback } from "react";
import { xxxService } from "../../../services/api";
import { usePagination, useNotification } from "../../../hooks";

export const usePageName = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [dialogs, setDialogs] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });

  const { page, limit, totalPages, handlePageChange, updatePagination } =
    usePagination();
  const { showSuccess, showError } = useNotification();

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await xxxService.getAll({
        page,
        limit,
        search: searchTerm,
      });
      setData(result.items);
      updatePagination(result.pagination);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // CRUD operations
  const handleAdd = async (formData) => {
    try {
      await xxxService.create(formData);
      showSuccess("Thêm thành công!");
      closeDialog("add");
      loadData();
    } catch (error) {
      showError(error.message);
    }
  };

  // ... other handlers

  return {
    data,
    stats,
    loading,
    dialogs,
    // ... other states and handlers
  };
};
```

### Template cho index.jsx:

```javascript
import { Container, Typography, Card, CardContent } from "@mui/material";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import DataTable from "./components/DataTable";
import { usePageName } from "./usePageName";

const PageName = () => {
  const {
    data,
    stats,
    loading,
    // ... other states
  } = usePageName();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Page Title
      </Typography>

      <StatsCards stats={stats} />
      <SearchBar {...searchProps} />

      <Card>
        <CardContent>
          <DataTable data={data} {...tableProps} />
        </CardContent>
      </Card>

      {/* Dialogs */}
    </Container>
  );
};

export default PageName;
```

## 🎯 Các bước migrate một trang cũ:

1. **Tạo cấu trúc folder mới**

   ```bash
   mkdir -p pages/Admin/PageName/components
   ```

2. **Tách components từ file cũ**
   - Tìm các phần UI lớn (Stats, Search, Table, Dialogs)
   - Tạo file riêng cho mỗi component
   - Export default từ mỗi file

3. **Tạo custom hook**
   - Copy toàn bộ logic (useState, useEffect, handlers)
   - Thay fetch bằng service calls
   - Return tất cả states và handlers cần thiết

4. **Tạo main component**
   - Import components và hook
   - Render UI với data từ hook
   - Giữ code minimal, chỉ layout

5. **Test và fix bugs**

## 📝 Checklist khi migrate:

- [ ] Tạo folder structure
- [ ] Tách components vào folder components/
- [ ] Tạo custom hook với logic
- [ ] Sử dụng service layer (không fetch trực tiếp)
- [ ] Sử dụng shared hooks (usePagination, useNotification)
- [ ] Tạo main component index.jsx
- [ ] Test chức năng
- [ ] Xóa file cũ (sau khi test xong)

## 🚀 Ưu tiên migrate:

1. ✅ UserManagement (Hoàn thành)
2. 🔄 OrderManagement (Đang làm)
3. ⏳ ProductOrderManagement
4. ⏳ ProductManagement
5. ⏳ AdminDashboard
6. ⏳ User pages (HomePage, Profile, etc.)

## 💡 Tips:

- Mỗi component chỉ làm 1 việc
- Props drilling không quá 2 levels
- Sử dụng composition thay vì inheritance
- Keep components pure khi có thể
- Error boundaries cho production
