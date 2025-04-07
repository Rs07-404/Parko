import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Clear the accessToken cookie by setting it to expire in the past
        res.setHeader(
            "Set-Cookie",
            serialize("accessToken", "", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date(0), // Expire it immediately
            })
        );

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in logout controller", error.message);
            return res.status(400).json({ error: error.message });
        }

        console.log("Error in logout controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
