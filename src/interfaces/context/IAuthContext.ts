import { Dispatch, SetStateAction } from "react";
import { IUser } from "@/interfaces/IUser.js";

export interface IAuthContext {
    authUser: IUser | null;
    authLoading: boolean;
    setAuthUser: Dispatch<SetStateAction<IUser | null>>;
    loadSession: () => void;
}