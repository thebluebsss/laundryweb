# 🔄 Hướng dẫn Migration Backend ProLaundry

## ✅ Đã hoàn thành

### 1. Tái cấu trúc Backend theo chuẩn RESTful API

**Cấu trúc mới:**

```
be/
├── src/
│   ├── config/          # Database, Swagger, Environment
│   ├── middleware/      # Auth, Rate Limiter
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API endpoints
│   ├── models/          # Mongoose schemas
│   ├── utils/           # Validators, Logger, Error handler
│   ├── app.js           # Express app
│   └── server.js        # Server entry point
├── .env
├── .env.example
├── package.json
└── README.md
```

### 2. Công nghệ đã thêm

- ✅ **Swagger/OpenAPI 3.0** - API Documentation
- ✅ **Joi** - Request validation
- ✅ **Winston** - Logging
- ✅ **express-rate-limit** - Rate limiting
- ✅ **Custom Error Handling** - Consistent error responses

### 3. API Endpoints đã tạo

#### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy profile (auth)
- `PATCH /api/auth/profile` - Cập nhật profile (auth)
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu

#### Users (Admin)

- `GET /api/users` - Danh sách users
- `GET /api/users/:id` - Chi tiết user
- `POST /api/users` - Tạo user
- `PATCH /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user
- `PATCH /api/users/:id/toggle-active` - Kích hoạt/vô hiệu hóa
- `GET /api/users/stats` - Thống kê users
- `GET /api/users-stats` - Alias (backward compatibility)

#### Bookings

- `GET /api/bookings` - Danh sách bookings (admin)
- `GET /api/bookings/:id` - Chi tiết booking
- `GET /api/bookings/phone/:phone` - Tìm theo SĐT
- `POST /api/bookings` - Tạo booking
- `PATCH /api/bookings/:id/status` - Cập nhật trạng thái (admin)
- `PATCH /api/bookings/:id/payment-status` - Cập nhật thanh toán (admin)
- `DELETE /api/bookings/:id` - Xóa booking (admin)
- `GET /api/stats` - Thống kê bookings (admin) - Alias

#### Orders

- `POST /api/orders` - Tạo order (auth)
- `GET /api/orders` - Danh sách orders của user (auth)
- `GET /api/orders/:id` - Chi tiết order
- `PATCH /api/orders/:id/status` - Cập nhật trạng thái (admin)
- `PATCH /api/orders/:id/payment-status` - Cập nhật thanh toán (admin)
- `PATCH /api/orders/:id/cancel` - Hủy order (auth)
- `GET /api/admin/orders` - Tất cả orders (admin) - Alias

#### Products

- `GET /api/products` - Danh sách products
- `GET /api/products/:id` - Chi tiết product
- `GET /api/products/recommendations` - Sản phẩm gợi ý
- `POST /api/products` - Tạo product (admin)
- `PATCH /api/products/:id` - Cập nhật product (admin)
- `DELETE /api/products/:id` - Xóa product (admin)
- `GET /api/recommendations/:bookingId` - Recommendations by booking - Alias

#### Equipment (Admin)

- `GET /api/equipment` - Danh sách equipment
- `GET /api/equipment/:id` - Chi tiết equipment
- `POST /api/equipment` - Tạo equipment
- `PATCH /api/equipment/:id` - Cập nhật equipment
- `DELETE /api/equipment/:id` - Xóa equipment

#### Payments

**Booking Payments:**

- `POST /api/payment/vnpay/create` - Tạo VNPay URL
- `POST /api/payment/vnpay/ipn` - VNPay callback
- `POST /api/payment/momo/create` - Tạo MoMo payment
- `POST /api/payment/momo/ipn` - MoMo callback
- `POST /api/payment/payos/create` - Tạo PayOS payment
- `POST /api/payment/payos/webhook` - PayOS webhook
- `POST /api/payment/stripe/create-intent` - Tạo Stripe intent
- `POST /api/payment/calculate-price` - Tính giá dịch vụ
- `GET /api/payment/status/:bookingId` - Lấy payment status

**Product Order Payments:**

- `POST /api/payment/products/vnpay/create`
- `POST /api/payment/products/vnpay/ipn`
- `POST /api/payment/products/momo/create`
- `POST /api/payment/products/momo/ipn`
- `POST /api/payment/products/payos/create`
- `POST /api/payment/products/payos/webhook`
- `POST /api/payment/products/stripe/create-intent`
- `GET /api/payment/products/status/:orderId`

### 4. Backward Compatibility

Đã thêm các alias routes để tương thích với frontend cũ:

- `/api/users-stats` → `/api/users/stats`
- `/api/stats` → `/api/bookings/stats`
- `/api/admin/orders` → `/api/orders/admin`
- `/api/recommendations/:bookingId` → `/api/products/recommendations`

## 🚀 Cách chạy

### Backend

```bash
cd be

# Cài đặt dependencies
npm install

# Chạy development mode
npm run dev

# Chạy production mode
npm start
```

### Frontend

Frontend không cần thay đổi gì vì backend đã tương thích ngược!

```bash
cd fe

# Cài đặt dependencies (nếu chưa)
npm install

# Chạy development
npm run dev
```

## 📚 Swagger Documentation

Sau khi chạy backend, truy cập:

```
http://localhost:3001/api-docs
```

Tại đây bạn có thể:

- Xem tất cả API endpoints
- Test API trực tiếp
- Xem request/response schema
- Authorize với JWT token

## 🔑 Testing API

### 1. Đăng ký tài khoản

```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phone": "0123456789"
}
```

### 2. Đăng nhập

```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Response sẽ trả về token:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Sử dụng token

```bash
GET http://localhost:3001/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting (15 phút / 100 requests)
- ✅ Auth rate limiting (15 phút / 5 requests)
- ✅ Payment rate limiting (1 giờ / 10 requests)
- ✅ Input validation (Joi)
- ✅ CORS protection
- ✅ Error handling
- ✅ Request logging (Winston)

## 📊 Response Format

### Success

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🎯 Best Practices đã áp dụng

1. **Separation of Concerns**
   - Controllers: Xử lý request/response
   - Services: Business logic
   - Models: Data layer
   - Routes: Endpoint definitions

2. **Error Handling**
   - Custom error classes
   - Global error handler
   - Async error wrapper

3. **Validation**
   - Request validation với Joi
   - Schema validation
   - Error messages rõ ràng

4. **Security**
   - JWT authentication
   - Rate limiting
   - Input sanitization
   - CORS configuration

5. **Documentation**
   - Swagger/OpenAPI
   - Code comments
   - README files

6. **Logging**
   - Winston logger
   - Request logging
   - Error logging

## 📝 Environment Variables

File `.env` cần có:

```env
PORT=3001
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://...
EMAIL_USER=your-email
EMAIL_PASS=your-password
# ... các biến khác
```

Xem file `.env.example` để biết đầy đủ các biến cần thiết.

## 🐛 Troubleshooting

### Lỗi: Cannot overwrite model

**Nguyên nhân:** Models bị import nhiều lần

**Giải pháp:** Đã fix bằng cách check `mongoose.models` trước khi tạo model mới

### Lỗi: Module not found

**Nguyên nhân:** Import path sai

**Giải pháp:** Đảm bảo tất cả import path đúng với cấu trúc mới

### Frontend không kết nối được

**Nguyên nhân:** CORS hoặc port sai

**Giải pháp:**

- Kiểm tra `fe/src/config/api.js` có đúng `http://localhost:3001/api`
- Kiểm tra backend đang chạy ở port 3001

## ✨ Lợi ích của cấu trúc mới

1. **Dễ bảo trì**: Code được tổ chức rõ ràng
2. **Dễ test**: Mỗi layer có thể test riêng
3. **Dễ mở rộng**: Thêm feature mới dễ dàng
4. **Dễ debug**: Error handling tốt hơn
5. **Dễ document**: Swagger tự động
6. **Dễ collaborate**: Team dễ hiểu code
7. **Production-ready**: Có logging, rate limiting, validation

## 🎉 Kết luận

Backend đã được tái cấu trúc hoàn toàn theo chuẩn RESTful API với:

- ✅ Swagger documentation
- ✅ Proper error handling
- ✅ Request validation
- ✅ Rate limiting
- ✅ Logging
- ✅ Security best practices
- ✅ Backward compatibility với frontend cũ

Frontend có thể chạy ngay mà không cần thay đổi gì!
