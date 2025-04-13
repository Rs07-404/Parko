import { IBoundary } from "./IBoundary";
import { IParkingSpot } from "./IParkingSpot";

export interface IParkingArea {
  _id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  boundary: IBoundary;
  parkingSpots: IParkingSpot[];
  // Add more fields if needed
}