import { NextRequest , NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connectDb } from "@/dbConfig/dbConfig";
import crypto from "crypto";

export async function POST(request:NextRequest) {
    try {
        await connectDb();

        const reqBody = await request.json();
        const {token , password}= reqBody;

        if(!token || typeof token !=="string" || !password || typeof password !=="string"){
            return NextResponse.json({
                error: "token and password are required"
            },{
                status : 400
            })
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        
        const user = await User.findOne({forgotPasswordToken : hashedToken,forgotPasswordTokenExpiry:{$gt:new Date()}})

        if(!user){
            return NextResponse.json({
                error:"Invalid or expired Token"
            },{status : 400})
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        user.password = hashedPassword;

        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined

        await user.save();

        return NextResponse.json({
            message : "password reser successfull. Please log in with your new Password"
        })

    } catch (error:any) {
        console.error("reset password error:" , error);
        
                return NextResponse.json(
                  { error: "Unable to process your request. Please try again." },
                  { status: 500 },
                );
    }
}