import mongoose from "mongoose";

// Define the interface for the ParkingSpot model
export interface IParkingSpot {
    spotNumber: string;
    location: {
        type: 'Point';
        coordinates: number[];
    };
    status: 'available' | 'occupied';
    sensorId?: string;
}

const parkingSpotSchema = new mongoose.Schema<IParkingSpot>({
    spotNumber: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates:{
            type: [Number],
            required: true,
        },
    },
    status: {
        type: String,
        enum: ['available', 'occupied'],
        default: 'available',
    },
    sensorId: {
        type: String,
    },
}, {timestamps: true});

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

export default ParkingSpot;