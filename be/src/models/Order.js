import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customerInfo: {
      name: String,
      phone: String,
      email: String,
      address: String,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "vnpay", "momo", "bank_transfer"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded", "cancelled"],
      default: "unpaid",
    },
    paymentDetails: {
      transactionId: String,
      paymentGateway: String,
      amount: Number,
      currency: { type: String, default: "VND" },
      paidAt: Date,
      cardLast4: String,
      bankName: String,
      gatewayResponse: Object,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    orderType: {
      type: String,
      enum: ["product_purchase", "service_booking"],
      default: "product_purchase",
    },
    shippingAddress: {
      street: String,
      city: String,
      district: String,
      ward: String,
      postalCode: String,
    },
    notes: {
      type: String,
      default: "",
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual("subtotal").get(function () {
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
