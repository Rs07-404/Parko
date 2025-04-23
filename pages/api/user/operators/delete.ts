// Delete an operator

import User from "@root/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== "DELETE"){
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const { operatorId } = await JSON.parse(req.body);
        await User.findByIdAndDelete(operatorId);
        res.status(200).json({ message: "Operator deleted successfully" });
    } catch (error) {
        console.error("Error deleting operator:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default withRoleGuard(handler, ["Admin"]);

