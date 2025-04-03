import { Dispatch, SetStateAction } from "react";
import { IUser } from "@/interfaces/IUser.js";

export interface IAuthContext {
    authUser: IUser | null;
    setAuthUser: Dispatch<SetStateAction<IUser | null>>;
    authLoading: boolean;
}