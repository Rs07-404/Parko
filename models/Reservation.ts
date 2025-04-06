import mongoose from "mongoose";

// interface for reservation data
export interface IReservationData {
    userId: mongoose.Schema.Types.ObjectId;
    parkingSpotId: mongoose.Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status?: string;
    verified?: boolean;
}

const reservationSchema = new mongoose.Schema<IReservationData>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // parkingAreaId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    parkingSpotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
        required: true,
    },
    // vehicleId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Vehicle',
    //     required: true,
    // },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    status:{
        type: String,
        enum: ['confirmed','parked','completed','canceled'],
        default: 'confirmed',
    },
    verified: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});


const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
export default Reservation;