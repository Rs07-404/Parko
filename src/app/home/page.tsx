"use client"
import Map from "@/components/Map/map"
import ParkingAreas from "@/components/Map/mapComponents/ParkingAreas"
import React, { useEffect } from "react";
import SpotSelectionModal from "@/components/Reservation/SpotSelectionModal";
import { useDispatch } from "react-redux";
import fetchCurrentReservation from "@/actions/reservation/get-current-reservation";
import { setReservation } from "@/store/slices/ReservationSlice";
import registerPush from "@/actions/registerPush";
import { useAuthContext } from "@/context/auth-context";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function Home() {
    const dispatch = useDispatch();
    const {authUser} = useAuthContext();
    const getReservation = async () => {
        const currentTime = new Date();
        try {
            const response = await fetchCurrentReservation(currentTime.toISOString());
            const data = await response.json();
            if (!response.ok) {
                return;
            }
            dispatch(setReservation(data.reservation));
        } catch (e) {
            return e;
        }
    }
    useEffect(() => {
        if (authUser?.roles.includes("Operator")) {
            redirect("/verify-reservation");
        }
        getReservation();
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            registerPush();
        }

    }, [])
    if (authUser?.roles.includes("EntryOperator") || authUser?.roles.includes("ExitOperator")) {
        return (
            <div className="flex flex-col h-full w-full justify-center items-center">
                <h1>You are not authorized to access this page</h1>
                <Button onClick={() => redirect("/verify-reservation")}>Go to Verify Reservation</Button>
            </div>
        )
    }
    return (
        <>
            <div className="flex h-full w-full justify-center items-center">
                <Map>
                    <ParkingAreas />
                </Map>
            </div>
            <SpotSelectionModal />
        </>
    )
}