import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({
  email,
  emailType,
  userId,
  resetToken,
}: any) => {
  try {
    let token = "";
    //create a hashed token

    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      token = hashedToken;
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      if (!resetToken) {
        throw new Error("Reset token is required");
      }

      token = resetToken;
    } else {
      throw new Error("Invalid email type");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 2525),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const baseUrl = process.env.DOMAIN;

    if (!baseUrl) {
      throw new Error("DOMAIN env variable is missing");
    }

    const actionUrl =
      emailType === "VERIFY"
        ? `${baseUrl}/verifyEmail?token=${encodeURIComponent(token)}`
        : `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6;">
            <h2>
              ${
                emailType === "VERIFY"
                  ? "Verify Your Email"
                  : " Reset Your Password"
              }
            </h2>

            <p>
              ${
                emailType === "VERIFY"
                  ? "Click the button to verify your Email Address"
                  : "CLick the button to reset your password"
              }
            </p>
            
            <a href = "${actionUrl}"
                style="display:inline-block;padding:12px 20px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;"
            >
                ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}

            </a>
            <p>If you didn't request this, you can ignore this email.</p> 

            </div>
        `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
