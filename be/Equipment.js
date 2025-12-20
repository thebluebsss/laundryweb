import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["washing-machine", "dryer", "iron", "other"],
    },
    model: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    purchaseDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["working", "maintenance", "broken"],
      default: "working",
    },
    location: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);
export default Equipment;
