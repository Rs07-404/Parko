import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { connectToDatabase } from "@root/lib/mongodb";
import User from "@root/models/User";
import { JWT_SECRET } from "@root/config/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    await connectToDatabase();

    if (!JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error: JWT_SECRET is missing" });
    }

    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, roles: string[] };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        return res.status(200).json({ message: "Token valid", user });
    } catch (error: unknown ) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Internal server error.", error: error.message });
        }
        return res.status(500).json({ message: "Internal server error." });
    }
}
