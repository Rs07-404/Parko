import { IParkingArea } from "./Generic/IParkingArea";

export interface IUser{
    _id: string;
    email: string;
    userName: string;
    mobile: string;
    roles: string[];
    currentReservation?: string | null;
    profile:{
        firstName: string;
        lastName: string;
        image: string;
    };
    parkingArea?: IParkingArea | null;
    emailVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}