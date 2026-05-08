# ProLaundry Backend API

Backend API cho hệ thống dịch vụ giặt là ProLaundry được xây dựng theo chuẩn RESTful API với Swagger documentation.

## 🏗️ Kiến trúc

```
be/
├── src/
│   ├── config/          # Cấu hình (database, swagger, env)
│   ├── middleware/      # Middleware (auth, rate limiter)
│   ├── controllers/     # Controllers (xử lý request/response)
│   ├── services/        # Services (business logic)
│   ├── routes/          # Routes (định nghĩa endpoints)
│   ├── models/          # Models (Mongoose schemas)
│   ├── utils/           # Utilities (validators, logger, error handler)
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
├── server.js            # Old server (backup)
├── package.json
└── .env
```

## 🚀 Công nghệ sử dụng

- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI 3.0
- **Logging**: Winston
- **Rate Limiting**: express-rate-limit
- **Payment Gateways**: Stripe, VNPay, MoMo, PayOS

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Cập nhật các biến môi trường trong .env
```

## 🔧 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/prolaundry

# JWT
JWT_SECRET=your-secret-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_...
VNPAY_TMN_CODE=...
MOMO_PARTNER_CODE=...
PAYOS_CLIENT_ID=...
```

## 🏃 Chạy ứng dụng

```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start

# Chạy server cũ (backup)
npm run old-server
```

## 📚 API Documentation

Sau khi chạy server, truy cập Swagger UI tại:

```
http://localhost:3000/api-docs
```

## 🔑 Authentication

API sử dụng JWT Bearer Token để xác thực.

### Đăng ký

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "0123456789",
  "address": "123 Main St"
}
```

### Đăng nhập

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

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

### Sử dụng token

```bash
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy profile (auth)
- `PATCH /api/auth/profile` - Cập nhật profile (auth)
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu

### Users (Admin only)

- `GET /api/users` - Danh sách users
- `GET /api/users/:id` - Chi tiết user
- `POST /api/users` - Tạo user
- `PATCH /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user
- `PATCH /api/users/:id/toggle-active` - Kích hoạt/vô hiệu hóa
- `GET /api/users/stats` - Thống kê users

### Bookings

- `GET /api/bookings` - Danh sách bookings (admin)
- `GET /api/bookings/:id` - Chi tiết booking
- `GET /api/bookings/phone/:phone` - Tìm theo SĐT
- `POST /api/bookings` - Tạo booking
- `PATCH /api/bookings/:id/status` - Cập nhật trạng thái (admin)
- `PATCH /api/bookings/:id/payment-status` - Cập nhật thanh toán (admin)
- `DELETE /api/bookings/:id` - Xóa booking (admin)
- `GET /api/stats` - Thống kê bookings (admin)

### Orders

- `POST /api/orders` - Tạo order (auth)
- `GET /api/orders` - Danh sách orders của user (auth)
- `GET /api/admin/orders` - Tất cả orders (admin)
- `GET /api/orders/:id` - Chi tiết order
- `PATCH /api/orders/:id/status` - Cập nhật trạng thái (admin)
- `PATCH /api/orders/:id/payment-status` - Cập nhật thanh toán (admin)
- `PATCH /api/orders/:id/cancel` - Hủy order (auth)

### Products

- `GET /api/products` - Danh sách products
- `GET /api/products/:id` - Chi tiết product
- `GET /api/products/recommendations` - Sản phẩm gợi ý
- `POST /api/products` - Tạo product (admin)
- `PATCH /api/products/:id` - Cập nhật product (admin)
- `DELETE /api/products/:id` - Xóa product (admin)

### Equipment (Admin only)

- `GET /api/equipment` - Danh sách equipment
- `GET /api/equipment/:id` - Chi tiết equipment
- `POST /api/equipment` - Tạo equipment
- `PATCH /api/equipment/:id` - Cập nhật equipment
- `DELETE /api/equipment/:id` - Xóa equipment

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password hashing với bcrypt
- ✅ Rate limiting
- ✅ Input validation với Joi
- ✅ CORS protection
- ✅ Error handling
- ✅ Request logging

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🧪 Testing với Swagger

1. Mở Swagger UI: `http://localhost:3000/api-docs`
2. Click "Authorize" button
3. Nhập token: `Bearer <your-token>`
4. Test các endpoints

## 🧪 Testing với Postman

1. Import Swagger JSON từ: `http://localhost:3000/api-docs/swagger.json`
2. Tạo environment với biến `baseUrl` = `http://localhost:3000`
3. Tạo biến `token` để lưu JWT token
4. Test các endpoints

## 📝 Validation Rules

### User

- Username: 3-30 ký tự
- Email: Valid email format
- Password: Tối thiểu 6 ký tự
- Phone: 10-11 số

### Booking

- Service: Phải thuộc danh sách dịch vụ
- PickupDate: ISO date format
- Phone: 10-11 số

### Order

- Items: Tối thiểu 1 sản phẩm
- Quantity: Tối thiểu 1

## 🚨 Error Codes

- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Token invalid/expired)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 📈 Logging

Logs được ghi bằng Winston với format:

```
2026-05-08 13:53:00 [info]: GET /api/bookings
2026-05-08 13:53:01 [error]: MongoDB Connection Error
```

## 🔄 Migration từ server cũ

Server cũ vẫn được giữ lại tại `server.js` (backup). Để chạy:

```bash
npm run old-server
```

## 🎯 Best Practices

1. **Phân tách concerns**: Controllers → Services → Models
2. **Validation**: Validate input với Joi
3. **Error handling**: Sử dụng custom error classes
4. **Logging**: Log mọi request và error
5. **Security**: Rate limiting, JWT, input validation
6. **Documentation**: Swagger cho mọi endpoint

## 🤝 Contributing

1. Tạo branch mới: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Tạo Pull Request

## 📄 License

MIT License
