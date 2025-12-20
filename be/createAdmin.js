import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const MONGODB_URI =
  "mongodb+srv://thebluebsss:Tumotden9@long.lmfudoa.mongodb.net/?appName=long";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ["user", "admin", "guest"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB");

    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("⚠️  Tài khoản admin đã tồn tại!");
      console.log("Username: admin");
      console.log("Email:", existingAdmin.email);
      const newPassword = "admin123";
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      await existingAdmin.save();
    } else {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const admin = new User({
        username: "admin",
        email: "admin@prolaundry.com",
        password: hashedPassword,
        fullName: "Administrator",
        phone: "0123456789",
        address: "Hà Nội",
        role: "admin",
      });

      await admin.save();
      console.log("Đã tạo tài khoản admin thành công!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("THÔNG TIN ĐĂNG NHẬP ADMIN:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Username: admin");
      console.log("Password: admin123");
      console.log("Email: admin@prolaundry.com");
      console.log("Role: admin");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    await mongoose.connection.close();
    console.log("Hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error(" Lỗi:", error);
    process.exit(1);
  }
}

createAdmin();
