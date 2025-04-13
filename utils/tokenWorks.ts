import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { serialize } from "cookie";
import { JWT_SECRET, NODE_ENV } from "@root/config/constants";

export const signUser = (userId: string, roles: string[], res:NextApiResponse) => {
    try{
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const token = jwt.sign({id: userId, roles: roles}, JWT_SECRET, {
            expiresIn: '15d'
        })
    
        res.setHeader(
            "Set-Cookie",
            serialize("accessToken", token, {
                httpOnly: true,
                secure: NODE_ENV === "production",
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7,
            })
        )
    }catch(error){
        if (error instanceof Error) {
            console.error("Error in token works", error.message);
            return res.status(400).json({error: error.message});
        }
        // Handle unexpected errors
        res.status(500).json({error: "Internal Server Error"});
        console.log("Error in token works", error);
    }
}