import mongoose from "mongoose";
import ParkingArea from "@root/models/ParkingArea";
import ParkingSpot from "@root/models/ParkingSpot";
import User from "@root/models/User";
import Vehicle from "@root/models/Vehicle";
import Reservation from "@root/models/Reservation";

type MongooseModels = {
  User: typeof User;
  ParkingArea: typeof ParkingArea;
  ParkingSpot: typeof ParkingSpot;
  Vehicle: typeof Vehicle;
  Reservation: typeof Reservation;
};

const registerModels = () => {
  const models: MongooseModels = {
    User,
    ParkingArea,
    ParkingSpot,
    Vehicle,
    Reservation
  };

  Object.entries(models).forEach(([name, model]) => {
    if (!mongoose.models[name]) {
      mongoose.model(name, model.schema);
    }
  });

  console.log("✅ All models are registered:", mongoose.modelNames());
};

export default registerModels;
