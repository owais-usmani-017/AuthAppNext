import {connectDb} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        const {email,password} = reqBody
        console.log(reqBody)

        //check if user exist
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({
                error : "user does not found",
                status: 404
            })
        }

        //check if password is correct
        const validPassword = bcrypt.compare(password,user.password)

        if(!validPassword){
            return NextResponse.json({
                error: "Invalid Password",
                status :400
            })
        }

        //jab user ka existence aur password verify ho gaya ab hum token bana ke bhejenge 

        //create jwt token
        const tokenData= {
            id : user._id,
            username : user.username,
            email: user.email
        }

        //create token
        const token = await jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET! , {expiresIn : "1d"});

        //token ban gaya but abhi bheja nahi hai ab pehle ek response banayenge fir bhejenege (directly bhejenge to cookiess acces nhi hoga isliye pehle banayenge fir bhejenege)

        const response  = NextResponse.json({
            message : "Login Successfull",
            success :true
        })
        
        //seting the cookie
        response.cookies.set("token" , token ,
            {
                httpOnly : true
            }
        )

        //now return response normally 
        return response;

    } catch (error:any) {
        return NextResponse.json({
            error: error.message,
            status : 500
        })
    }
}