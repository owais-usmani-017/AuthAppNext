import {connectDb} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";




connectDb();

export async function POST( request: NextRequest) {
    try{
        const reqBody = await request.json();
        const {username , email , password} = reqBody

        if(!username || !email || !password){
            return NextResponse.json(
                {error: "Please fill all the fields"},
                {status : 400}
            )
        }

        console.log(reqBody)

        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json(
                {error : "User already exists"},
                {status : 400}
            )
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt)

        const newUser = new User({
            username : username,
            password : hashedPassword,
            email : email
        })

        const savedUser = await newUser.save();
        console.log(savedUser)

        //send verification Email
        sendEmail
        return NextResponse.json(
            {
                message : "User created successfully",
                status : 201,
                success: true,
                savedUser
            }
        )


    }catch(error:any){
        return NextResponse.json(
            {error: error.message},
            {status : 500}
        )
    }
}