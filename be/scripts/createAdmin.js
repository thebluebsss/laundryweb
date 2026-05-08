import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Username:", existingAdmin.username);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      fullName: "Administrator",
      phone: "0123456789",
      address: "Admin Address",
      role: "admin",
      isActive: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email:", admin.email);
    console.log("Username:", admin.username);
    console.log("Password: 123456");
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdmin();
