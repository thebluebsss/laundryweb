import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import bookingRoutes from "./bookings.js";
import orderRoutes from "./orders.js";
import productRoutes from "./products.js";
import equipmentRoutes from "./equipment.js";
import paymentRoutes from "./payments.js";

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/bookings", bookingRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/payment", paymentRoutes);

// Alias routes for backward compatibility with old frontend
import * as userController from "../controllers/userController.js";
import * as bookingController from "../controllers/bookingController.js";
import * as orderController from "../controllers/orderController.js";
import * as productController from "../controllers/productController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

router.get(
  "/users-stats",
  authenticateToken,
  requireAdmin,
  userController.getUserStats,
);
router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  bookingController.getBookingStats,
);
router.get(
  "/admin/orders",
  authenticateToken,
  requireAdmin,
  orderController.getAllOrders,
);
router.get("/recommendations/:bookingId", productController.getRecommendations);

export default router;
