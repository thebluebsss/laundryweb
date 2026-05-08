import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected\n");

    // Find admin
    const admin = await User.findOne({ username: "admin" });

    if (!admin) {
      console.log("❌ Admin not found!");
      process.exit(1);
    }

    // Reset password to 123456
    const newPassword = "123456";
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    console.log("✅ Admin password reset successfully!");
    console.log("");
    console.log("Login credentials:");
    console.log("Username:", admin.username);
    console.log("Email:", admin.email);
    console.log("Password:", newPassword);
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetPassword();
