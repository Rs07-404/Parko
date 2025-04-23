import { IParkingArea } from "./IParkingArea";
import { ITicketKey } from "./ITicketKey";
export interface IReservationData {
    _id: string;
    userId: string;
    parkingSpotId: string;
    startTime: Date;
    endTime: Date;
    status?: string;
    verified?: boolean;
}

export interface IReservation {
    _id: string;
    userId: string;
    parkingAreaId: IParkingArea;
    startTime: Date;
    endTime: Date;
    verified?: boolean;
    parkingSpots: {_id: string, spotNumber: number}[];
    ticketKey: ITicketKey;
    bookingTime: string;
    entryTime?: string;
    exitTime?: string;
    status: "Booked" | "Entered" | "Completed" | "Canceled";
}

