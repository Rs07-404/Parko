export interface IUser{
    _id: string;
    email: string;
    userName: string;
    mobile: string;
    roles: string[];
    profile:{
        firstName: string;
        lastName: string;
        image: string;
    }
}