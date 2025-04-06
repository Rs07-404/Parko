"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/interfaces/IUser.js";
import { IAuthContext } from "@/interfaces/context/IAuthContext";

export const AuthContext = createContext<IAuthContext>({
    authUser: null,
    authLoading: false,
    setAuthUser: () => {},
    loadSession: () => {},
});

import { ReactNode } from "react";
import fetchSession from "@/actions/auth/session";

export const AuthContextProvider= ({ children }: { children: ReactNode }) => {
    const [authUser, setAuthUser] = useState<IUser |  null>(null);
    const [ authLoading, setAuthLoading] = useState<boolean>(false);


    const loadSession = async () => {
        setAuthLoading(true);
        try{
            const response = await fetchSession();
            if(!response.ok){
                setAuthUser(null);
            }else{
                const user = await response.json();
                setAuthUser(user.user);
            }
        } catch (error){
            if(error instanceof Error){}
        } finally {
            setAuthLoading(false);
        }
    }

    useEffect(()=>{
        
        loadSession();
        console.log("AuthContextProvider mounted");
    },[])


    return <AuthContext.Provider value={{ authUser, loadSession, setAuthUser, authLoading }}>
        {children}
        </AuthContext.Provider>;
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    } 
    return context;
}