import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@root/models/User";
import { GaurdedRequest } from "../interfaces/IRequest";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface CustomJwtPayload extends JwtPayload {
  id: string;
  roles: string[];
}

// Higher-order function to restrict routes based on roles
export function withRoleGuard(handler: NextApiHandler, allowedRoles: string[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

      const userRoles = decoded.roles;
      const userId = decoded.id;

      const user = await User.findById(userId);

      const isAllowed = (user && user._id) && userRoles.some(role => allowedRoles.includes(role));

      if (!isAllowed) {
        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      }

      // Attach user data to request if needed later
      (req as GaurdedRequest).user = user;

      return handler(req, res);
    } catch (error) {
      console.error("RoleGuard error:", error);
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }
  };
}
