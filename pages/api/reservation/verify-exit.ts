// pages/api/reservations/verify.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@root/lib/mongodb";
import Reservation from "@root/models/Reservation";
import scanQRCodeFromImage from "@root/utils/scanImage";
import { decryptEncryptedPayload } from "@root/utils/qrcodeworks";
import { withRoleGuard } from "@root/lib/middlewares/withRoleGuard";
import User from "@root/models/User";
import { sendPushNotification } from "@root/utils/pushNotification";
import mongoose from "mongoose";
import ParkingSpot from "@root/models/ParkingSpot";

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
    const encryptedPayload = image ? await scanQRCodeFromImage(image) : ticketKey;

    if (!encryptedPayload || typeof encryptedPayload !== "string") {
      return res.status(400).json({ message: "Invalid Key or Image" });
    }

    // Connect to database
    await connectToDatabase();

    const data = await decryptEncryptedPayload(encryptedPayload);
    if (!data?.userId || !data?.reservationid || !data?.parkingAreaId || !data?.bookingTime) {
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

    // Check if current reservation is same as the reservationid in the data
    if (user.currentReservation.toString() !== data.reservationid.toString()) {
      return res.status(400).json({
        message: "Current reservation is not the same in the image or key"
      });
    }

    const existingReservation = await Reservation.findById(user.currentReservation);

    if (existingReservation) {
      // switch case for status
      switch (existingReservation.status) {
        case "Booked":
          return res.status(400).json({
            message: "Current reservation is not entered"
          });
        case "Entered":
          // transaction to update reservation and user
          // setup transaction to update reservation and user at same time
          const session = await mongoose.startSession();
          session.startTransaction();
          existingReservation.verified = true;
          existingReservation.exitTime = currentTime;
          existingReservation.status = "Completed";
          user.currentReservation = null;

          await ParkingSpot.updateMany({ _id: { $in: existingReservation.parkingSpots } }, { $set: { status: 'available' } }, { session });
          await existingReservation.save({ session });
          await user.save({ session });
          await session.commitTransaction();
          // Clear user's current reservation
          await sendPushNotification({
            userId: existingReservation.userId,
            title: 'Exit Verified',
            body: 'You Can Exit the Parking Area!',
          });
          return res.status(200).json({
            message: "Exit verified",
          });
        case "Cancelled":
          return res.status(400).json({
            message: "Current reservation is cancelled"
          });
        case "Completed":
          return res.status(400).json({
            message: "Current reservation is completed"
          });
        default:
          return res.status(400).json({
            message: "Reservation is invalid"
          });
      }
    } else {
      return res.status(400).json({
        message: "No Current Reservation Found"
      });
    }

  } catch (error) {
    console.error("Error verifying reservation:", (error as Error).message);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}

export default withRoleGuard(handler, ["Admin", "ExitOperator"])