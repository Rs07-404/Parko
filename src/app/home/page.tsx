"use client"
import Map from "@/components/Map/map"
import ParkingAreas from "@/components/Map/mapComponents/ParkingAreas"
import React from "react"

export default function Home() {
    return (
        <div className="flex h-[calc(100vh-56px)] w-full justify-center items-center">
            <Map>
                <ParkingAreas />
            </Map>
        </div>
    )
}