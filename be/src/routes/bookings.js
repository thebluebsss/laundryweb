import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { validate } from "../utils/validators.js";
import {
  createBookingSchema,
  updateBookingStatusSchema,
  updatePaymentStatusSchema,
} from "../utils/validators.js";

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Lấy danh sách bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng items mỗi trang
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, completed, cancelled]
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get("/", authenticateToken, requireAdmin, bookingController.getBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Lấy chi tiết booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 *       404:
 *         description: Booking không tồn tại
 */
router.get("/:id", bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/phone/{phone}:
 *   get:
 *     summary: Tìm booking theo số điện thoại
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tìm thành công
 */
router.get("/phone/:phone", bookingController.getBookingsByPhone);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Tạo booking mới
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - address
 *               - service
 *               - pickupDate
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               service:
 *                 type: string
 *               pickupDate:
 *                 type: string
 *                 format: date-time
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *               estimatedWeight:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo booking thành công
 */
router.post(
  "/",
  validate(createBookingSchema),
  bookingController.createBooking,
);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái booking
 *     tags: [Bookings]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, processing, completed, cancelled]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus,
);

/**
 * @swagger
 * /api/bookings/{id}/payment-status:
 *   patch:
 *     summary: Cập nhật trạng thái thanh toán
 *     tags: [Bookings]
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
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed, refunded]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  "/:id/payment-status",
  authenticateToken,
  requireAdmin,
  validate(updatePaymentStatusSchema),
  bookingController.updatePaymentStatus,
);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Xóa booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  bookingController.deleteBooking,
);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Thống kê bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 */
router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  bookingController.getBookingStats,
);

export default router;
