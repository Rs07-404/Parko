import { GaurdedRequest } from "@root/lib/interfaces/IRequest";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import User from "@root/models/User";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @route GET /api/users/profile
 * @access Users and Admins
 * @desc Get the profile of the logged-in user
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        await connectToDatabase();
    
        const userId = (req as GaurdedRequest).user._id; // Assuming you have middleware to set req.user
    
        const user = await User.findById(userId).select("-password -__v").populate("vehicles").populate("reservations");
    
        if (!user) {
        return res.status(404).json({ message: "User not found." });
        }
    
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

export default withRoleGuard(handler, ["Admin", "User"]);