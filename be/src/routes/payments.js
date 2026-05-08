import express from "express";
import * as paymentController from "../controllers/paymentController.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * @swagger
 * /api/payment/vnpay/create:
 *   post:
 *     summary: Tạo VNPay payment URL cho booking
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               amount:
 *                 type: number
 *               orderInfo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tạo payment URL thành công
 */
router.post(
  "/vnpay/create",
  paymentLimiter,
  paymentController.createVNPayBooking,
);

/**
 * @swagger
 * /api/payment/vnpay/ipn:
 *   post:
 *     summary: VNPay IPN callback
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: IPN processed
 */
router.post("/vnpay/ipn", paymentController.vnpayIPN);

/**
 * @swagger
 * /api/payment/momo/create:
 *   post:
 *     summary: Tạo MoMo payment cho booking
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Tạo payment thành công
 */
router.post(
  "/momo/create",
  paymentLimiter,
  paymentController.createMoMoBooking,
);

/**
 * @swagger
 * /api/payment/momo/ipn:
 *   post:
 *     summary: MoMo IPN callback
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: IPN processed
 */
router.post("/momo/ipn", paymentController.momoIPN);

/**
 * @swagger
 * /api/payment/payos/create:
 *   post:
 *     summary: Tạo PayOS payment cho booking
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Tạo payment thành công
 */
router.post(
  "/payos/create",
  paymentLimiter,
  paymentController.createPayOSBooking,
);

/**
 * @swagger
 * /api/payment/payos/webhook:
 *   post:
 *     summary: PayOS webhook
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post("/payos/webhook", paymentController.payosWebhook);

/**
 * @swagger
 * /api/payment/stripe/create-intent:
 *   post:
 *     summary: Tạo Stripe payment intent cho booking
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Tạo payment intent thành công
 */
router.post(
  "/stripe/create-intent",
  paymentLimiter,
  paymentController.createStripeIntentBooking,
);

/**
 * @swagger
 * /api/payment/calculate-price:
 *   post:
 *     summary: Tính giá dịch vụ
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Tính giá thành công
 */
router.post("/calculate-price", paymentController.calculatePrice);

/**
 * @swagger
 * /api/payment/status/{bookingId}:
 *   get:
 *     summary: Lấy payment status của booking
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy status thành công
 */
router.get("/status/:bookingId", paymentController.getBookingPaymentStatus);

// Product payment routes
/**
 * @swagger
 * /api/payment/products/vnpay/create:
 *   post:
 *     summary: Tạo VNPay payment URL cho order
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Tạo payment URL thành công
 */
router.post(
  "/products/vnpay/create",
  paymentLimiter,
  paymentController.createVNPayOrder,
);

/**
 * @swagger
 * /api/payment/products/vnpay/ipn:
 *   post:
 *     summary: VNPay IPN callback cho order
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: IPN processed
 */
router.post("/products/vnpay/ipn", paymentController.vnpayIPN);

/**
 * @swagger
 * /api/payment/products/momo/create:
 *   post:
 *     summary: Tạo MoMo payment cho order
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Tạo payment thành công
 */
router.post(
  "/products/momo/create",
  paymentLimiter,
  paymentController.createMoMoOrder,
);

/**
 * @swagger
 * /api/payment/products/momo/ipn:
 *   post:
 *     summary: MoMo IPN callback cho order
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: IPN processed
 */
router.post("/products/momo/ipn", paymentController.momoIPN);

/**
 * @swagger
 * /api/payment/products/payos/create:
 *   post:
 *     summary: Tạo PayOS payment cho order
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Tạo payment thành công
 */
router.post(
  "/products/payos/create",
  paymentLimiter,
  paymentController.createPayOSOrder,
);

/**
 * @swagger
 * /api/payment/products/payos/webhook:
 *   post:
 *     summary: PayOS webhook cho order
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post("/products/payos/webhook", paymentController.payosWebhook);

/**
 * @swagger
 * /api/payment/products/stripe/create-intent:
 *   post:
 *     summary: Tạo Stripe payment intent cho order
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Tạo payment intent thành công
 */
router.post(
  "/products/stripe/create-intent",
  paymentLimiter,
  paymentController.createStripeIntentOrder,
);

/**
 * @swagger
 * /api/payment/products/status/{orderId}:
 *   get:
 *     summary: Lấy payment status của order
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy status thành công
 */
router.get(
  "/products/status/:orderId",
  paymentController.getOrderPaymentStatus,
);

export default router;
