import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ProLaundry API Documentation",
      version: "1.0.0",
      description: "API documentation cho hệ thống dịch vụ giặt là ProLaundry",
      contact: {
        name: "ProLaundry Support",
        email: "support@prolaundry.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.prolaundry.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Nhập JWT token để xác thực",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Success message",
            },
            data: {
              type: "object",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "API xác thực người dùng",
      },
      {
        name: "Users",
        description: "API quản lý người dùng",
      },
      {
        name: "Bookings",
        description: "API quản lý đơn giặt",
      },
      {
        name: "Orders",
        description: "API quản lý đơn hàng sản phẩm",
      },
      {
        name: "Products",
        description: "API quản lý sản phẩm",
      },
      {
        name: "Equipment",
        description: "API quản lý thiết bị",
      },
      {
        name: "Payments",
        description: "API thanh toán",
      },
      {
        name: "Chat",
        description: "API chat AI",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Đường dẫn tới các file routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
