// Get all operators

import User from "@root/models/User";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const operators = await User.find({ roles: { $in: ["EntryOperator", "ExitOperator"] } })
        .populate({
            path: "parkingArea",
            select: "name address"
        });
        res.status(200).json(operators);
    } catch (error) {
        console.error("Error fetching operators:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default withRoleGuard(handler, ["Admin"]);
