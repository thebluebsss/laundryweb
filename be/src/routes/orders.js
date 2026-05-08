import express from "express";
import * as orderController from "../controllers/orderController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { validate } from "../utils/validators.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "../utils/validators.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo order mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - customerInfo
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               customerInfo:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *     responses:
 *       201:
 *         description: Tạo order thành công
 */
router.post(
  "/",
  authenticateToken,
  validate(createOrderSchema),
  orderController.createOrder,
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách orders của user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get("/", authenticateToken, orderController.getUserOrders);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Lấy tất cả orders (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get(
  "/admin",
  authenticateToken,
  requireAdmin,
  orderController.getAllOrders,
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 */
router.get("/:id", orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);

/**
 * @swagger
 * /api/orders/{id}/payment-status:
 *   patch:
 *     summary: Cập nhật trạng thái thanh toán
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  "/:id/payment-status",
  authenticateToken,
  requireAdmin,
  validate(updatePaymentStatusSchema),
  orderController.updateOrderPaymentStatus,
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Hủy order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hủy order thành công
 */
router.patch("/:id/cancel", authenticateToken, orderController.cancelOrder);

export default router;
