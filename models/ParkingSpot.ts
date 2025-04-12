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
    areaId: mongoose.Schema.Types.ObjectId;
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
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function (value: number[]) {
                    return value.length === 2;
                },
                message: 'Coordinates must contain exactly two numbers (latitude and longitude).',
            },
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
    areaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingArea',
        required: true
    }
}, { timestamps: true });

const ParkingSpot = mongoose.models.ParkingSpot || mongoose.model('ParkingSpot', parkingSpotSchema);

export default ParkingSpot;