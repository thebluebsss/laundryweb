import nodemailer from "nodemailer";
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Gửi OTP qua email
export const sendOTPEmail = async (email, otp, userName = "Khách hàng") => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "Hệ Thống Giặt Là Prolaundry",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Mã OTP Đặt Lại Mật Khẩu - Prolaundry",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
            }
            .otp-box {
              background: #f0f7ff;
              border: 2px dashed #1976d2;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #1976d2;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6c757d;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #1976d2;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧺 Prolaundry</h1>
              <p>Hệ Thống Giặt Là Chuyên Nghiệp</p>
            </div>
            
            <div class="content">
              <h2>Xin chào ${userName}!</h2>
              <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666;">Mã OTP của bạn là:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; color: #666; font-size: 14px;">Mã có hiệu lực trong 10 phút</p>
              </div>
              
              <p><strong>Vui lòng không chia sẻ mã này với bất kỳ ai!</strong></p>
              
              <div class="warning">
                <strong>⚠️ Lưu ý:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi ngay lập tức.
              </div>
              
              <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
              
              <p>Trân trọng,<br><strong>Đội ngũ Prolaundry</strong></p>
            </div>
            
            <div class="footer">
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
              <p>© 2025 Prolaundry. All rights reserved.</p>
              <p>Hotline: 1900-xxxx | Email: support@prolaundry.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email đã gửi thành công:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(" Lỗi gửi email:", error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetConfirmation = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "Hệ Thống Giặt Là Prolaundry",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Đặt Lại Mật Khẩu Thành Công - Prolaundry",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
            }
            .success-icon {
              font-size: 64px;
              text-align: center;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧺 Prolaundry</h1>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <h2 style="text-align: center; color: #4caf50;">Đặt Lại Mật Khẩu Thành Công!</h2>
              <p>Xin chào ${userName},</p>
              <p>Mật khẩu của bạn đã được đặt lại thành công vào lúc ${new Date().toLocaleString(
                "vi-VN"
              )}.</p>
              <p>Bạn có thể đăng nhập ngay bây giờ với mật khẩu mới.</p>
              <p><strong>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức!</strong></p>
              <p>Trân trọng,<br><strong>Đội ngũ Prolaundry</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(" Email xác nhận đã gửi thành công");
    return { success: true };
  } catch (error) {
    console.error(" Lỗi gửi email xác nhận:", error);
    return { success: false, error: error.message };
  }
};
