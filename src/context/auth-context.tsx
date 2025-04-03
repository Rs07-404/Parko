"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/interfaces/IUser.js";
import { IAuthContext } from "@/interfaces/context/IAuthContext";

export const AuthContext = createContext<IAuthContext>({
    authUser: null,
    setAuthUser: () => {},
    authLoading: false
});

import { ReactNode } from "react";

export const AuthContextProvider= ({ children }: { children: ReactNode }) => {
    const [authUser, setAuthUser] = useState<IUser |  null>(null);
    const [ authLoading, setAuthLoading] = useState<boolean>(false);

    useEffect(()=>{
        setAuthLoading(true);
        const verify = async () => {
            try{
                const response = await fetch('/api/auth/verifylogin');
                const user = await response.json();
                if(user.error){
                    setAuthUser(null);
                }else{
                    setAuthUser(user);
                }
            } catch (error){
                if(error instanceof Error){}
            } finally {
                setAuthLoading(false);
            }
        }
        verify();
    },[])


    return <AuthContext.Provider value={{ authUser, setAuthUser, authLoading }}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    } 
    return context;
}