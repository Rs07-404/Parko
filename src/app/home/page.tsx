"use client"
import Map from "@/components/Map/map"
import ParkingAreas from "@/components/Map/mapComponents/ParkingAreas"
import React, { useEffect } from "react";
import SpotSelectionModal from "@/components/Reservation/SpotSelectionModal";
import { useDispatch } from "react-redux";
import fetchCurrentReservation from "@/actions/reservation/get-current-reservation";
import { setReservation } from "@/store/slices/ReservationSlice";


export default function Home() {
    const dispatch = useDispatch()
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
        getReservation();
    }, [])
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