import mongoose from "mongoose";

export interface IParkingArea {
    name: string;
    address: string;
    location: {
        location: {
            type: 'Point';
            coordinates: number[];
        };
    };
    boundary: {
        type: 'Polygon';
        coordinates: number[][][];
    };
    area?: number;
    parkingSpots?: mongoose.Schema.Types.ObjectId[];
    columns: number;
}

const parkingAreaSchema = new mongoose.Schema<IParkingArea>({
    name:{
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    location:{
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true,
            },
            coordinates:{
                type: [Number],
                required: true,
            },
        },
    },
    boundary:{
        type: {
            type: String,
            enum: ['Polygon'],
            required: true,
        },
        coordinates: {
            type: [[[Number]]],
            required: true,
        },
    },
    area: {
        type: Number,
        required: false,
    },
    parkingSpots: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParkingSpot',
            default: []
        }
    ],
    columns: {
        type: Number,
        requried: true
    }
})

const ParkingArea = mongoose.models.ParkingArea || mongoose.model('ParkingArea', parkingAreaSchema);
export default ParkingArea;