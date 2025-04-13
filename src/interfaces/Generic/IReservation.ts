
export interface IReservationData {
    _id: string;
    userId: string;
    parkingSpotId: string;
    parkingAreaId: string;
    startTime: Date;
    endTime: Date;
    status?: string;
    verified?: boolean;
}