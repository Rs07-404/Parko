"use client";

import { Marker, Popup } from "react-leaflet";
import { SpotAvailable, SpotBusy, SpotBooked } from "../icons/icons";
import { useAllParkingAreas } from "@/hooks/use-parkingAreas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const getMarkerIcon = (status: IParkingSpot["status"]) => {
  switch (status) {
    case "available":
      return SpotAvailable;
    case "occupied":
      return SpotBusy;
    default:
      return SpotBooked;
  }
};

export interface IParkingSpot {
    _id: string;
    spotNumber: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [latitude, longitude]
    };
    status: 'available' | 'occupied';
    sensorId?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  

const ParkingAreas = () => {
  const {
    allParkingAreas,
    fetchAllParkingAreas,
    AllAreaLoading,
  } = useAllParkingAreas();


  if (!allParkingAreas?.length) {
    toast.warning("No Parking Areas Found.");
    return null;
  }

  return (
    <>
      {allParkingAreas.map((area) =>
        area.parkingSpots?.map((spot) => {
          const [lat, lng] = spot.location.coordinates;

          return (
            <Marker
              key={spot._id}
              position={[lat, lng]}
              icon={getMarkerIcon(spot.status)}
            >
              <Popup>
                <div className="text-sm">
                  <div><strong>Spot No:</strong> {spot.spotNumber}</div>
                  <div><strong>Status:</strong> {spot.status}</div>
                  <div><strong>Sensor:</strong> {spot.sensorId || "N/A"}</div>
                </div>
              </Popup>
            </Marker>
          );
        })
      )}
      <Button
        className="absolute h-12 w-12 rounded-full p-0! m-0! has-[>svg]:px-0! py-0! [&_svg:not([class*='size-'])]:size-8 bottom-18 right-4 z-1000"
        onClick={fetchAllParkingAreas}
      >
        <RefreshCcw className={`${AllAreaLoading && "text-primary transition-all animate-pulse"}`} />

      </Button>
    </>
  );
};

export default ParkingAreas;
