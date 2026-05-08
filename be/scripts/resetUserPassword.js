import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected\n");

    const username = process.argv[2] || "admin";
    const newPassword = process.argv[3] || "123456";

    // Find user
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      console.log(`❌ User "${username}" not found!`);
      process.exit(1);
    }

    // Reset password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log("✅ Password reset successfully!");
    console.log("");
    console.log("Login credentials:");
    console.log("Username:", user.username);
    console.log("Email:", user.email);
    console.log("Password:", newPassword);
    console.log("Role:", user.role);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetPassword();
