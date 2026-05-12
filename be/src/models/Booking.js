import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional vì có thể có booking từ guest
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: String,
      enum: [
        // Giặt theo kg
        "giat-say-thuong",
        "giat-kho-kg",
        "giat-ui-kg",

        // Combo packages
        "combo-gia-dinh",
        "combo-sinh-vien",
        "combo-van-phong",

        // Bộ đồ
        "bo-complet",
        "bo-ki-gia",
        "bo-vet-nu",
        "bo-vet-khong-lot",
        "bo-the-thao",
        "bo-ngu",
        "bo-quan-ao-gio",
        "bo-quan-ao-dai-nhung",
        "bo-quan-ao-dai-thuong",

        // Áo
        "ao-so-mi",
        "ao-vest",
        "ao-khoac",
        "ao-len",
        "ao-da",

        // Quần
        "quan-tay",
        "quan-jean",
        "quan-kaki",
        "quan-short",

        // Váy
        "vay-cong-so",
        "vay-da-hoi",
        "vay-jean",

        // Chăn gối
        "chan-don",
        "chan-doi",
        "goi",
        "nem",

        // Đồ đặc biệt
        "ao-cuoi",
        "vay-cuoi",
        "do-da",
        "do-long-thu",

        "giat-say",
        "giat-kho",
        "giat-ui",
      ],
      required: true,
    },
    pickupDate: {
      type: Date,
      required: false,
    },
    deliveryDate: {
      type: Date,
      required: false,
    },
    detergent: {
      type: String,
      enum: ["Omo", "Gain", "Bột giặt của tôi"],
      default: "Omo",
    },
    bleach: {
      type: String,
      enum: ["Sử dụng", "Không sử dụng"],
      default: "Sử dụng",
    },
    useBag: {
      type: String,
      enum: ["Có", "Không"],
      default: "Có",
    },
    dryCleaningItems: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },
    estimatedWeight: {
      type: Number,
      required: false,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "bank_transfer", "vnpay", "momo"],
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
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ phone: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1 });

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
