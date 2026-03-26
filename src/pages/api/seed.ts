import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@root/lib/mongodb";
import User from "@root/models/User";
import ParkingArea from "@root/models/ParkingArea";
import ParkingSpot from "@root/models/ParkingSpot";

const USERS = [
  {
    email: "admin@parko.com",
    userName: "adminuser",
    password: "Admin@123",
    roles: ["Admin"],
    mobile: "1234567890",
    profile: {
      firstName: "Admin",
      lastName: "User",
      image: ""
    },
    emailVerified: true,
  },
  {
    email: "landowner@parko.com",
    userName: "landowneruser",
    password: "LandOwner@123",
    roles: ["LandOwner"],
    mobile: "1234567893",
    profile: {
      firstName: "Land",
      lastName: "Owner",
      image: ""
    },
    emailVerified: true,
  },
  {
    email: "entryoperator@parko.com",
    userName: "entryoperatoruser",
    password: "EntryOp@123",
    roles: ["EntryOperator"],
    mobile: "1234567894",
    profile: {
      firstName: "Entry",
      lastName: "Operator",
      image: ""
    },
    emailVerified: true,
    parkingArea: "6782637f3c6747e0c4ad2f5f",
  },
  {
    email: "exitoperator@parko.com",
    userName: "exitoperatoruser",
    password: "ExitOp@123",
    roles: ["ExitOperator"],
    mobile: "1234567895",
    profile: {
      firstName: "Exit",
      lastName: "Operator",
      image: ""
    },
    emailVerified: true,
    parkingArea: "6782637f3c6747e0c4ad2f5f",
  },
  {
    email: "user@parko.com",
    userName: "useruser",
    password: "User@123",
    roles: ["User"],
    mobile: "1234567892",
    profile: {
      firstName: "Customer",
      lastName: "User",
      image: ""
    },
    emailVerified: true,
  },
];

const PARKING_AREAS = [
  {
    _id: "6782637f3c6747e0c4ad2f5f",
    name: "WIT Parking Area",
    address:
      "634, Walchand Hirachand Marg, Ashok Chowk, Solapur, Maharashtra 413006",
    location: {
      location: {
        type: "Point",
        coordinates: [75.9250708337626, 17.67002419960833],
      },
    },
    boundary: {
      type: "Polygon",
      coordinates: [
        [
          [75.92468264815103, 17.670406621522556],
          [75.92565514552795, 17.670420050701722],
          [75.92557981912455, 17.668937194907155],
          [75.9245038401578, 17.66900093920603],
          [75.92468264815103, 17.670406621522556],
        ],
      ],
    },
    area: 1500,
    columns: 2,
  },
];

// Predefined parking spots for WIT Parking Area
const WIT_PARKING_SPOTS = [
  {
    _id: "676d8f44ede0b2ced00d2a7a",
    spotNumber: "WIT P1",
    location: {
      type: "Point",
      coordinates: [75.9228, 17.6686],
    },
    status: "available",
    sensorId: "sensor_009",
    areaId: "6782637f3c6747e0c4ad2f5f",
    disabled: true,
  },
  {
    _id: "67fab21a27b982d89faf4999",
    spotNumber: "WIT P2",
    location: {
      type: "Point",
      coordinates: [75.9251, 17.6692],
    },
    status: "available",
    areaId: "6782637f3c6747e0c4ad2f5f",
    disabled: true,
  },
  {
    _id: "67fab21a27b982d89faf499a",
    spotNumber: "WIT P3",
    location: {
      type: "Point",
      coordinates: [75.9251, 17.669227],
    },
    status: "occupied",
    areaId: "6782637f3c6747e0c4ad2f5f",
    disabled: false,
  },
  {
    _id: "67fab21a27b982d89faf499b",
    spotNumber: "WIT P4",
    location: {
      type: "Point",
      coordinates: [75.9251, 17.669254],
    },
    status: "occupied",
    areaId: "6782637f3c6747e0c4ad2f5f",
    disabled: true,
  },
  {
    _id: "67fab21a27b982d89faf499c",
    spotNumber: "WIT P5",
    location: {
      type: "Point",
      coordinates: [75.9251, 17.669281],
    },
    status: "available",
    areaId: "6782637f3c6747e0c4ad2f5f",
    disabled: false,
  },
  {
    _id: "67fab21a27b982d89faf499d",
    spotNumber: "WIT P6",
    location: {
      type: "Point",
      coordinates: [75.9251, 17.669308],
    },
    status: "available",
    areaId: "6782637f3c6747e0c4ad2f5f",
    disabled: false,
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    await connectToDatabase();
    const userCount = await User.countDocuments();
    const parkingCount = await ParkingArea.countDocuments();
    if (userCount > 0 || parkingCount > 0) {
      return res.status(500).json({ message: "Database already seeded." });
    }
    // Seed users (one for each role)
    for (const user of USERS) {
      await User.create(user);
    }
    // Seed WIT Parking Area and its spots
    const area = PARKING_AREAS[0];
    // Insert area with fixed _id
    const areaDoc = await ParkingArea.create({
      _id: area._id,
      name: area.name,
      address: area.address,
      location: area.location,
      boundary: area.boundary,
      area: area.area,
      columns: area.columns,
    });
    // Insert spots with fixed _id and areaId
    const spotDocs = await ParkingSpot.insertMany(
      WIT_PARKING_SPOTS.map((s) => ({
        ...s,
        areaId: area._id,
      })),
    );
    // Update area with spot references
    areaDoc.parkingSpots = spotDocs.map((s) => s._id);
    await areaDoc.save();
    return res.status(200).json({ message: "Database seeded successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Seeding failed.",
      error: error instanceof Error ? error.message : error,
    });
  }
}
