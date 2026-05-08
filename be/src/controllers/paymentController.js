import { asyncHandler } from "../utils/errorHandler.js";
import { successResponse } from "../utils/response.js";
import * as paymentService from "../services/paymentService.js";
import * as bookingService from "../services/bookingService.js";
import * as orderService from "../services/orderService.js";

/**
 * @desc    Tạo VNPay payment URL cho booking
 * @route   POST /api/payment/vnpay/create
 * @access  Public
 */
export const createVNPayBooking = asyncHandler(async (req, res) => {
  const { bookingId, amount, orderInfo } = req.body;
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const paymentUrl = await paymentService.createVNPayPaymentUrl(
    bookingId,
    amount,
    orderInfo,
    ipAddr,
  );

  successResponse(res, { paymentUrl }, "Tạo payment URL thành công");
});

/**
 * @desc    Tạo VNPay payment URL cho order
 * @route   POST /api/payment/products/vnpay/create
 * @access  Private
 */
export const createVNPayOrder = asyncHandler(async (req, res) => {
  const { orderId, amount, orderInfo } = req.body;
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const paymentUrl = await paymentService.createVNPayPaymentUrl(
    orderId,
    amount,
    orderInfo,
    ipAddr,
  );

  successResponse(res, { paymentUrl }, "Tạo payment URL thành công");
});

/**
 * @desc    VNPay IPN callback
 * @route   POST /api/payment/vnpay/ipn
 * @access  Public
 */
export const vnpayIPN = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyVNPayIPN(req.query);

  if (result.success) {
    // Cập nhật payment status
    const { orderId, amount, transactionId } = result.data;

    try {
      await bookingService.updatePaymentStatus(orderId, "paid", {
        transactionId,
        gateway: "vnpay",
        amount,
      });
    } catch (error) {
      // Nếu không phải booking, thử order
      await orderService.updateOrderPaymentStatus(orderId, "paid", {
        transactionId,
        gateway: "vnpay",
        amount,
      });
    }
  }

  res.json(result);
});

/**
 * @desc    Tạo MoMo payment cho booking
 * @route   POST /api/payment/momo/create
 * @access  Public
 */
export const createMoMoBooking = asyncHandler(async (req, res) => {
  const { bookingId, amount, orderInfo } = req.body;

  const result = await paymentService.createMoMoPayment(
    bookingId,
    amount,
    orderInfo,
  );

  successResponse(res, result, "Tạo MoMo payment thành công");
});

/**
 * @desc    Tạo MoMo payment cho order
 * @route   POST /api/payment/products/momo/create
 * @access  Private
 */
export const createMoMoOrder = asyncHandler(async (req, res) => {
  const { orderId, amount, orderInfo } = req.body;

  const result = await paymentService.createMoMoPayment(
    orderId,
    amount,
    orderInfo,
  );

  successResponse(res, result, "Tạo MoMo payment thành công");
});

/**
 * @desc    MoMo IPN callback
 * @route   POST /api/payment/momo/ipn
 * @access  Public
 */
export const momoIPN = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyMoMoIPN(req.body);

  if (result.success) {
    const { orderId, amount, transactionId } = result.data;

    try {
      await bookingService.updatePaymentStatus(orderId, "paid", {
        transactionId,
        gateway: "momo",
        amount,
      });
    } catch (error) {
      await orderService.updateOrderPaymentStatus(orderId, "paid", {
        transactionId,
        gateway: "momo",
        amount,
      });
    }
  }

  res.json(result);
});

/**
 * @desc    Tạo PayOS payment cho booking
 * @route   POST /api/payment/payos/create
 * @access  Public
 */
export const createPayOSBooking = asyncHandler(async (req, res) => {
  const { bookingId, amount, orderInfo, items } = req.body;

  const result = await paymentService.createPayOSPayment(
    bookingId,
    amount,
    orderInfo,
    items,
  );

  successResponse(res, result, "Tạo PayOS payment thành công");
});

/**
 * @desc    Tạo PayOS payment cho order
 * @route   POST /api/payment/products/payos/create
 * @access  Private
 */
export const createPayOSOrder = asyncHandler(async (req, res) => {
  const { orderId, amount, orderInfo, items } = req.body;

  const result = await paymentService.createPayOSPayment(
    orderId,
    amount,
    orderInfo,
    items,
  );

  successResponse(res, result, "Tạo PayOS payment thành công");
});

/**
 * @desc    PayOS webhook
 * @route   POST /api/payment/payos/webhook
 * @access  Public
 */
export const payosWebhook = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyPayOSWebhook(req.body);

  if (result.success) {
    const { orderId, amount, transactionId } = result.data;

    try {
      await bookingService.updatePaymentStatus(orderId, "paid", {
        transactionId,
        gateway: "payos",
        amount,
      });
    } catch (error) {
      await orderService.updateOrderPaymentStatus(orderId, "paid", {
        transactionId,
        gateway: "payos",
        amount,
      });
    }
  }

  res.json(result);
});

/**
 * @desc    Tạo Stripe payment intent cho booking
 * @route   POST /api/payment/stripe/create-intent
 * @access  Public
 */
export const createStripeIntentBooking = asyncHandler(async (req, res) => {
  const { bookingId, amount } = req.body;

  const result = await paymentService.createStripePaymentIntent(
    bookingId,
    amount,
  );

  successResponse(res, result, "Tạo Stripe payment intent thành công");
});

/**
 * @desc    Tạo Stripe payment intent cho order
 * @route   POST /api/payment/products/stripe/create-intent
 * @access  Private
 */
export const createStripeIntentOrder = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  const result = await paymentService.createStripePaymentIntent(
    orderId,
    amount,
  );

  successResponse(res, result, "Tạo Stripe payment intent thành công");
});

/**
 * @desc    Tính giá dịch vụ
 * @route   POST /api/payment/calculate-price
 * @access  Public
 */
export const calculatePrice = asyncHandler(async (req, res) => {
  const { service, weight, dryCleaningItems } = req.body;

  const pricing = paymentService.calculateServicePrice(
    service,
    weight,
    dryCleaningItems,
  );

  successResponse(res, pricing, "Tính giá thành công");
});

/**
 * @desc    Lấy payment status của booking
 * @route   GET /api/payment/status/:bookingId
 * @access  Public
 */
export const getBookingPaymentStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.bookingId);

  successResponse(
    res,
    {
      paymentStatus: booking.paymentStatus,
      paymentDetails: booking.paymentDetails,
    },
    "Lấy payment status thành công",
  );
});

/**
 * @desc    Lấy payment status của order
 * @route   GET /api/payment/products/status/:orderId
 * @access  Public
 */
export const getOrderPaymentStatus = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);

  successResponse(
    res,
    {
      paymentStatus: order.paymentStatus,
      paymentDetails: order.paymentDetails,
    },
    "Lấy payment status thành công",
  );
});
