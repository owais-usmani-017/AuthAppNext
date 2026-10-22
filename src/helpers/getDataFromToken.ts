import {NextRequest} from "next/server";
import jwt from "jsonwebtoken";
import { request } from "http";

export const getDataFromToken = (request : NextRequest)=>{
    try {
        const encodedToken = request.cookies.get("token")?.value || '';
        const decodedToken:any = jwt.verify(
          encodedToken,
          process.env.JWT_TOKEN_SECRET!,
        );
        return decodedToken.id;
    } catch (error:any) {
        throw new error(error.message)
    }
}