import twilio from "twilio";

// Khởi tạo Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Gửi OTP qua SMS
export const sendOTPSMS = async (phone, otp) => {
  try {
    // Định dạng số điện thoại theo chuẩn quốc tế (+84...)
    let formattedPhone = phone;
    if (phone.startsWith("0")) {
      formattedPhone = "+84" + phone.substring(1);
    } else if (!phone.startsWith("+")) {
      formattedPhone = "+84" + phone;
    }

    const message = await twilioClient.messages.create({
      body: `[Prolaundry] Ma OTP cua ban la: ${otp}. Ma co hieu luc trong 10 phut. Vui long khong chia se!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("✅ SMS đã gửi thành công:", message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error("❌ Lỗi gửi SMS:", error);
    return { success: false, error: error.message };
  }
};

// Gửi SMS xác nhận đặt lại mật khẩu
export const sendPasswordResetSMS = async (phone) => {
  try {
    let formattedPhone = phone;
    if (phone.startsWith("0")) {
      formattedPhone = "+84" + phone.substring(1);
    } else if (!phone.startsWith("+")) {
      formattedPhone = "+84" + phone;
    }

    const message = await twilioClient.messages.create({
      body: `[Prolaundry] Mat khau cua ban da duoc dat lai thanh cong. Neu khong phai ban, vui long lien he ngay!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("✅ SMS xác nhận đã gửi:", message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error("❌ Lỗi gửi SMS xác nhận:", error);
    return { success: false, error: error.message };
  }
};
