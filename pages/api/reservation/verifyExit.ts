// pages/api/reservations/verify.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@root/lib/mongodb";
import Reservation from "@root/models/Reservation";
import scanQRCodeFromImage from "@root/utils/scanImage";
import { decryptEncryptedPayload } from "@root/utils/qrcodeworks";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import User from "@root/models/User";

/**
 * @description Verifies a parking reservation based on QR code in an image for exit
 * @route POST /api/reservations/verifyExit
 * @access Operators and Admins
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const currentTime = new Date();
    const { image, ticketKey } = req.body;
    let encryptedPayload;

    // Validate key or image
    if (image) {
      encryptedPayload = await scanQRCodeFromImage(image);
    } else if (ticketKey) {
      encryptedPayload = ticketKey;
    } else {
      return res.status(400).json({ message: "Validation key or image is invalid." });
    }

    if (!encryptedPayload || typeof encryptedPayload !== "string") {
      return res.status(400).json({ message: "Invalid Key or Image" });
    }

    // Connect to database
    await connectToDatabase();

    const data = await decryptEncryptedPayload(encryptedPayload);
    
    if (!data?.userId) {
      return res.status(400).json({ message: "Invalid Key or Image" });
    }

    const user = await User.findById(data.userId);
    

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user has a current reservation
    if (!user.currentReservation) {
      return res.status(400).json({
        message: "User has no current reservation"
      });
    }


    const existingReservation = await Reservation.findById(user.currentReservation);

    if (existingReservation) {
      existingReservation.verified = true;
      existingReservation.entryTime = currentTime;
      existingReservation.status = "entered";
      await existingReservation.save();

      return res.status(200).json({
        message: "Entry verified",
      });
    }

    return res.status(200).json({
      message: "No reservations found during the current time for the given parking area.",
    });

  } catch (error) {
    console.error("Error verifying reservation:", (error as Error).message);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}

export default withRoleGuard(handler, ["Admin", "EntryOperator"])