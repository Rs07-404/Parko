import mongoose from "mongoose";

export interface IParkingArea {
    name: string;
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
}

const parkingAreaSchema = new mongoose.Schema<IParkingArea>({
    name:{
        type: String,
        required: true,
    },
    location:{
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
    ]
})


const ParkingArea = mongoose.model('ParkingArea', parkingAreaSchema);
export default ParkingArea;