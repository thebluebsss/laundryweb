# Frontend Refactoring Guide

## 📁 Cấu trúc mới

```
fe/src/
├── components/
│   ├── atoms/          # Component nhỏ nhất (Button, Input, Label)
│   ├── molecules/      # Kết hợp atoms (SearchBar, FormField, Card)
│   ├── organisms/      # Kết hợp molecules (Header, Footer, DataTable)
│   └── templates/      # Layout templates (AdminLayout, UserLayout)
├── pages/
│   ├── Auth/
│   │   └── Login/
│   │       ├── components/     # Components riêng cho trang
│   │       ├── useLogin.js     # Custom hook cho logic
│   │       └── index.jsx       # Main page component
│   ├── Admin/          # Tất cả trang admin
│   │   ├── Dashboard/
│   │   ├── UserManagement/
│   │   ├── OrderManagement/
│   │   └── ...
│   └── User/           # Tất cả trang user
│       ├── Home/
│       ├── Profile/
│       └── ...
├── services/
│   └── api/            # API service layer
│       ├── client.js
│       ├── authService.js
│       ├── bookingService.js
│       ├── orderService.js
│       ├── userService.js
│       └── index.js
├── hooks/              # Custom hooks tái sử dụng
│   ├── useAuth.js
│   ├── useApi.js
│   ├── usePagination.js
│   ├── useNotification.js
│   └── index.js
├── contexts/           # React contexts
├── utils/              # Utility functions
└── config/             # Configuration files
```

## 🎯 Quy tắc cấu trúc

### 1. Atomic Design Pattern

**Atoms** - Component nhỏ nhất, không thể chia nhỏ hơn

```jsx
// components/atoms/Button/index.jsx
export const Button = ({ children, ...props }) => {
  return <MuiButton {...props}>{children}</MuiButton>;
};
```

**Molecules** - Kết hợp nhiều atoms

```jsx
// components/molecules/SearchBar/index.jsx
export const SearchBar = ({ onSearch }) => {
  return (
    <Box>
      <Input />
      <Button onClick={onSearch}>Search</Button>
    </Box>
  );
};
```

**Organisms** - Kết hợp molecules và atoms

```jsx
// components/organisms/Header/index.jsx
export const Header = () => {
  return (
    <AppBar>
      <Logo />
      <Navigation />
      <UserMenu />
    </AppBar>
  );
};
```

**Templates** - Layout templates

```jsx
// components/templates/AdminLayout/index.jsx
export const AdminLayout = ({ children }) => {
  return (
    <Box>
      <Header />
      <Sidebar />
      <Main>{children}</Main>
    </Box>
  );
};
```

### 2. Page Structure

Mỗi trang nên có cấu trúc:

```
PageName/
├── components/         # Components riêng cho trang này
│   ├── ComponentA.jsx
│   ├── ComponentB.jsx
│   └── index.js       # Export tất cả components
├── usePageName.js     # Custom hook chứa logic
└── index.jsx          # Main page component
```

**Ví dụ:**

```jsx
// pages/Admin/UserManagement/useUserManagement.js
export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const { page, limit, handlePageChange } = usePagination();
  const { showSuccess, showError } = useNotification();

  const loadUsers = async () => {
    // Logic here
  };

  return {
    users,
    page,
    limit,
    loadUsers,
    handlePageChange,
  };
};

// pages/Admin/UserManagement/index.jsx
const UserManagement = () => {
  const { users, page, limit, loadUsers, handlePageChange } =
    useUserManagement();

  return (
    <Container>
      <UserTable users={users} />
      <Pagination page={page} onChange={handlePageChange} />
    </Container>
  );
};
```

### 3. Service Layer

Tất cả API calls phải đi qua service layer:

```jsx
// ❌ BAD - Gọi API trực tiếp trong component
const loadUsers = async () => {
  const response = await fetch("/api/users");
  const data = await response.json();
  setUsers(data);
};

// ✅ GOOD - Sử dụng service
import { userService } from "../services/api";

const loadUsers = async () => {
  const data = await userService.getUsers({ page, limit });
  setUsers(data.users);
};
```

### 4. Custom Hooks

Tách logic ra khỏi component:

```jsx
// ❌ BAD - Logic trong component
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await api.getData();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  return <div>{/* render */}</div>;
};

// ✅ GOOD - Logic trong custom hook
const useMyData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await api.getData();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  return { data, loading };
};

const MyComponent = () => {
  const { data, loading } = useMyData();
  return <div>{/* render */}</div>;
};
```

## 🔄 Migration Process

### Bước 1: Service Layer (✅ Hoàn thành)

- [x] Tạo API client
- [x] Tạo authService
- [x] Tạo bookingService
- [x] Tạo orderService
- [x] Tạo userService
- [x] Tạo productService

### Bước 2: Custom Hooks (✅ Hoàn thành)

- [x] useAuth
- [x] useApi
- [x] usePagination
- [x] useNotification

### Bước 3: Migrate Pages (🔄 Đang thực hiện)

- [x] LoginPage (Mẫu hoàn chỉnh)
- [ ] AdminDashboard
- [ ] UserManagement
- [ ] OrderManagement
- [ ] ProductManagement
- [ ] HomePage
- [ ] UserProfile

### Bước 4: Shared Components

- [ ] Tạo atoms (Button, Input, Badge, etc.)
- [ ] Tạo molecules (SearchBar, FormField, etc.)
- [ ] Tạo organisms (Header, Footer, DataTable, etc.)
- [ ] Tạo templates (AdminLayout, UserLayout, etc.)

## 📝 Checklist khi migrate một trang

- [ ] Tạo folder structure: `PageName/components/`, `usePageName.js`, `index.jsx`
- [ ] Tách logic vào custom hook
- [ ] Sử dụng service layer thay vì fetch trực tiếp
- [ ] Sử dụng shared hooks (useNotification, usePagination, etc.)
- [ ] Tách components nhỏ vào folder components/
- [ ] Export components qua index.js
- [ ] Test functionality
- [ ] Update routing nếu cần

## 🎨 Best Practices

1. **Single Responsibility**: Mỗi component chỉ làm 1 việc
2. **Reusability**: Tái sử dụng components và hooks
3. **Separation of Concerns**: Tách logic, UI, và API calls
4. **Consistent Naming**: Đặt tên rõ ràng, nhất quán
5. **Error Handling**: Xử lý lỗi ở service layer
6. **Loading States**: Quản lý loading state đúng cách
7. **Type Safety**: Sử dụng PropTypes hoặc TypeScript (nếu có)

## 🚀 Next Steps

1. Migrate AdminDashboard page
2. Migrate UserManagement page
3. Tạo shared components (Header, Footer, Sidebar)
4. Tạo AdminLayout và UserLayout templates
5. Migrate các trang còn lại

## 📚 Resources

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Component Composition](https://react.dev/learn/passing-props-to-a-component)
