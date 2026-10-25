import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export const sendEmail = async ({email,emailType,userId }:any) =>{
    try{
        //create a hashed token
        const hashedToken = await bcrypt.hash(userId.toString(),10)

        if(emailType==="VERIFY"){
            await User.findByIdAndUpdate(userId, {
              verifyToken: hashedToken,
              verifyTokenExpiry: Date.now() + 3600000,
            });
        }else if(emailType==="RESET"){
            await User.findByIdAndUpdate(userId, {
              forgotPasswordToken: hashedToken,
              forgotPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        const transporter = nodemailer.createTransport({
          host: "smtp.example.com",
          port: 587,
          secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
            from : 'owaisusmani.556677@gmail.com',
            to: email,
            subject : emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p> click <a href="${process.env.domain}/verifyemail?token=${hashedToken}"> here</a> to ${emailType ==="VERIFY" ? "verify your email" : "reset your password"}</p>`
        }

        const mailResponse = await transporter.sendMail(mailOptions);

        return mailResponse

    }catch(error:any){
        throw new Error(error.message)
    }
}
