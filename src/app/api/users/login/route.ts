import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 },
            );
        }

        //check if user exist
        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
        if(!user){
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 },
            );
        }

        //check if password is correct
        //
        const storedPassword = user.password;
        const validPassword =
            typeof storedPassword === "string" &&
            storedPassword.length > 0 &&
            await bcrypt.compare(password, storedPassword);

        if(!validPassword){
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 },
            );
        }

        //jab user ka existence aur password verify ho gaya ab hum token bana ke bhejenge 

        //create jwt token
        const tokenData= {
            id : user._id,
            username : user.username,
            email: user.email
        }

        //create token
        const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!, { expiresIn: "1d" });

        //token ban gaya but abhi bheja nahi hai ab pehle ek response banayenge fir bhejenege (directly bhejenge to cookiess acces nhi hoga isliye pehle banayenge fir bhejenege)

        const response  = NextResponse.json({
            message : "Login Successfull",
            success :true
        })
        
        //seting the cookie
        response.cookies.set("token", token,
            {
                httpOnly : true
            }
        )

        //now return response normally 
        return response;

    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unable to process login" },
            { status: 500 },
        );
    }
}