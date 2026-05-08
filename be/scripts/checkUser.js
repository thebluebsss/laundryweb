import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected\n");

    // Find all users
    const users = await User.find().select("-password");

    console.log(`Found ${users.length} users:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. User:`);
      console.log("   ID:", user._id);
      console.log("   Username:", user.username);
      console.log("   Email:", user.email);
      console.log("   Full Name:", user.fullName);
      console.log("   Phone:", user.phone);
      console.log("   Role:", user.role);
      console.log("   Active:", user.isActive);
      console.log("");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkUser();
