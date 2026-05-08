import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const forceReset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected\n");

    const newPassword = "123456";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log("New password:", newPassword);
    console.log("New hash:", hashedPassword);
    console.log("");

    // Update directly using updateOne
    const result = await mongoose.connection
      .collection("users")
      .updateOne({ username: "admin" }, { $set: { password: hashedPassword } });

    console.log("Update result:", result);

    if (result.modifiedCount > 0) {
      console.log("✅ Password updated successfully!");

      // Verify
      const user = await mongoose.connection
        .collection("users")
        .findOne({ username: "admin" });
      console.log("\nVerification:");
      console.log("Stored hash:", user.password);

      const isValid = await bcrypt.compare(newPassword, user.password);
      console.log("Password valid:", isValid);

      if (isValid) {
        console.log("\n✅ SUCCESS! You can now login with:");
        console.log("Username: admin");
        console.log("Password: 123456");
      } else {
        console.log("\n❌ FAILED! Hash mismatch");
      }
    } else {
      console.log("❌ No user updated");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

forceReset();
