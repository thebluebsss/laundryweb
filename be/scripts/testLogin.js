import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected\n");

    const username = "admin";
    const password = "123456";

    // Find user
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (!user) {
      console.log("❌ User not found!");
      process.exit(1);
    }

    console.log("✅ User found:");
    console.log("   Username:", user.username);
    console.log("   Email:", user.email);
    console.log("   Role:", user.role);
    console.log("   Active:", user.isActive);
    console.log("");

    // Test password
    console.log("Testing password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      console.log("✅ Password is correct!");
    } else {
      console.log("❌ Password is incorrect!");
      console.log("");
      console.log("Resetting password to 123456...");

      user.password = await bcrypt.hash("123456", 10);
      await user.save();

      console.log("✅ Password reset successfully!");
      console.log("");
      console.log("Try login again with:");
      console.log("Username:", user.username);
      console.log("Password: 123456");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

testLogin();
