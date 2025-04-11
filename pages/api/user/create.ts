// pages/api/users/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import { connectToDatabase } from "@root/lib/mongodb";
import User from "@root/models/User";

/**
 * @route POST /api/users/create
 * @access Admin only
 * @desc Create a new user with profile details split in request body
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      email,
      userName,
      password,
      roles = ["User"],
      mobile,
      firstName,
      lastName,
    } = req.body;

    if (!email || !userName || !password || !mobile || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    await connectToDatabase();

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const newUser = new User({
      email,
      userName,
      password,
      roles,
      mobile,
      profile: {
        firstName,
        lastName
      },
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully.",
      user: {
        _id: newUser._id,
        email: newUser.email,
        userName: newUser.userName,
        roles: newUser.roles,
        mobile: newUser.mobile,
        profile: newUser.profile,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export default withRoleGuard(handler, ["Admin"]);
