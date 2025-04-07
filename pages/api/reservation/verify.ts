// pages/api/reservations/verify.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@root/lib/mongodb";
import Reservation from "@root/models/Reservation";
import scanQRCodeFromImage from "@root/utils/scanImage";
import { decryptEncryptedPayload } from "@root/utils/qrcodeworks";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";

/**
 * @description Verifies a parking reservation based on QR code in an image
 * @route POST /api/reservations/verify
 * @access Public (can be guarded if needed)
 */
 async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const currentTime = new Date();
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    await connectToDatabase();

    const encryptedPayload = await scanQRCodeFromImage(image);
    if (!encryptedPayload || typeof encryptedPayload !== "string") {
      return res.status(400).json({ message: "Failed to extract details from QR code." });
    }

    const data = await decryptEncryptedPayload(encryptedPayload);

    if (!data?.userId) {
      return res.status(400).json({ message: "userId is required in the QR payload." });
    }

    const existingReservation = await Reservation.findOne({
      userId: data.userId,
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
      verified: false,
    });

    if (existingReservation) {
      existingReservation.verified = true;
      await existingReservation.save();

      return res.status(200).json({
        success: "A reservation exists during the current time for the given parking area.",
      });
    }

    return res.status(200).json({
      message: "No reservations found during the current time for the given parking area.",
    });
  } catch (error) {
    console.error("Error verifying reservation:", (error as Error).message);
    return res.status(500).json({
      message: "Server error occurred.",
      error: (error as Error).message,
    });
  }
}

export default withRoleGuard(handler, ["Admin", "Operator"])