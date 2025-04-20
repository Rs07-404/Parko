import mongoose from "mongoose";

// interface for reservation data
export interface IReservationData {
    userId: mongoose.Schema.Types.ObjectId;
    parkingAreaId: mongoose.Schema.Types.ObjectId;
    parkingSpots: mongoose.Schema.Types.ObjectId[];
    startTime: Date;
    endTime: Date;
    status?: string;
    bookingTime: Date;
    entryTime: Date;
    exitTime: Date;
    verified?: boolean;
    ticketKey: string;
}

const reservationSchema = new mongoose.Schema<IReservationData>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    parkingAreaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingArea',
        required: true
    },
    parkingSpots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
        required: true,
    }],
    ticketKey: {
        type: String,
        required: true,
    },
    // vehicleId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Vehicle',
    //     required: true,
    // },
    bookingTime: {
        type: Date,
        required: true,
    },
    entryTime: {
        type: Date,
        required: false,
    },
    exitTime: {
        type: Date,
        required: false,
    },
    status:{
        type: String,
        enum: ['booked','entered','closed','canceled'],
        default: 'booked',
    },
    verified: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});


const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
export default Reservation;