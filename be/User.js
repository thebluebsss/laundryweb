import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Vui lòng nhập tên đăng nhập"],
      unique: true,
      trim: true,
      minlength: [3, "Tên đăng nhập phải có ít nhất 3 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    fullName: {
      type: String,
      required: [true, "Vui lòng nhập họ tên"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Vui lòng nhập số điện thoại"],
      match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "guest"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
    },
    // Thêm các field cho reset password
    resetPasswordOTP: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordOTP;
  delete user.resetPasswordExpires;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
