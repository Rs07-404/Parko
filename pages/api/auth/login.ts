import { connectToDatabase } from "@root/lib/mongodb";
import User from "@root/models/User";
import { signUser } from "@root/utils/tokenWorks";
import { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        await connectToDatabase();

        const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        // Check if user exists and validate password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        console.log("User found:", user);

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Login the user
        signUser(user._id, user.roles, res);

        return res.status(200).json({data:{
                id: user._id,
                email: user.email,
                roles: user.roles,
        }});
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in login controller", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.error("Unexpected error in login controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}