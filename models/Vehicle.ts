import mongoose from "mongoose";

// interface for vehicle data
export interface IVehicleData {
    userId: mongoose.Schema.Types.ObjectId;
    name: string;
    model: string;
    numberPlate: string;
}

const vehicleSchema = new mongoose.Schema<IVehicleData>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    numberPlate:{
        type: String,
        required: true,
        unique: true,
    },
}, {timestamps: true});


const Vehicle =  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;