import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: ["detergent", "softener", "bleach", "bag", "accessory", "other"],
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      default: "chai",
    },
    weight: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    recommendFor: {
      type: [String],
      default: ["all"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ tags: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
