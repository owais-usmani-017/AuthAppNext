import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import crypto from "crypto";
import { sendEmail } from "@/helpers/mailer";



export async function POST(request:NextRequest){

    try {
      await connectDb();

      const reqBody = await request.json();
      const { email } = reqBody;

      if (!email || typeof email !== "string") {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 },
        );
      }

      const trimmedEmail = email.trim().toLowerCase();

      const user = await User.findOne({ email : trimmedEmail });

      if (!user) {
        return NextResponse.json({
          message:
            "If an account exists with this email, a reset link will be sent.",
        });
      }

      // Generate a cryptographically secure token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Store only the token hash in the database
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Token expires in 15 minutes
      user.forgotPasswordToken = hashedToken;
      user.forgotPasswordTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

      await user.save();

      //send the original token,not the hash
      await sendEmail({
        email: trimmedEmail,
        emailType : "RESET",
        userId : user._id,
        resetToken
      });

      return NextResponse.json({
        message:
          "If an account exists with this email, a reset link will be sent.",
      });

    } catch (error) {

        console.error("forgot password error:" , error);

        return NextResponse.json(
          { error: "Unable to process your request. Please try again." },
          { status: 500 },
        );
    }
}