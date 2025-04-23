"use client";

import { Marker, Polygon, Popup } from "react-leaflet";
import { SpotAvailable, SpotBusy, SpotBooked } from "../icons/icons";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IParkingSpot } from "@/interfaces/Generic/IParkingSpot";
import { useAllParkingAreas } from "@/hooks/use-parkingAreas";
import { IParkingArea } from "@/interfaces/Generic/IParkingArea";
import { useDispatch } from "react-redux";
import { selectParkingArea } from "@/store/slices/ParkingAreaSlice";
import { useAuthContext } from "@/context/auth-context";
import { toast } from "sonner";




const ParkingAreas = () => {
  const { allParkingAreas, fetchAllParkingAreas, AllAreaLoading } = useAllParkingAreas();
  const { authUser } = useAuthContext();

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

  const dispatch = useDispatch();

  const ParkingAreaPopUp: React.FC<{ parkingArea: IParkingArea, availableSpots: number }> = ({ parkingArea, availableSpots }) => {
    return (
      <Popup className="custom-popup" closeButton={false}>
        <Card className="text-sm w-full">
          <CardHeader className="p-0 pb-0 w-full flex justify-center">{parkingArea.name}</CardHeader>
          <Separator className="w-full" />
          <CardContent className="flex flex-col p-0 pt-0 items-center justify-center gap-2">
            <div className="flex w-full items-center justify-center gap-1">Spots Available: <span className="text-green-500">{availableSpots}</span></div>
            <div className="flex w-full items-center justify-center">
              <Button type="button"
                onClick={() => authUser?.currentReservation? toast.error("You already have an ongoing reservation") : dispatch(selectParkingArea(parkingArea))}
                variant={"secondary"}>
                View Spots
              </Button>
            </div>
          </CardContent>
        </Card>
      </Popup>
    )
  }

  return (
    <>
      {allParkingAreas?.length && allParkingAreas.map((area) => {
        const [lat, lng] = area.location.coordinates;
        const availableSpots = area.parkingSpots?.filter((spot) => spot.status === "available")
        const Icon = getMarkerIcon(availableSpots ? "available" : "occupied")
        const areaBounds = area.boundary.coordinates[0].map(
          ([lng, lat]: number[]) => [lat, lng] as [number, number]
        );
        return (
          <Marker
            key={area._id}
            position={[lat, lng]}
            icon={Icon}
          >
            <ParkingAreaPopUp parkingArea={area} availableSpots={availableSpots.length > 0 ? availableSpots.length : 0} />
            <Polygon positions={areaBounds} className="bg-primary border-none">
              <ParkingAreaPopUp parkingArea={area} availableSpots={availableSpots.length > 0 ? availableSpots.length : 0} />
            </Polygon>
          </Marker>
        );
      })

      }
      <Button
        className="absolute h-10 w-10 cursor-pointer bg-card-foreground hover:bg-background transition-all hover:text-primary duration-500 dark:bg-background rounded-full p-0! m-0! has-[>svg]:px-0! py-0! [&_svg:not([class*='size-'])]:size-8 bottom-18 right-4 z-1000"
        onClick={fetchAllParkingAreas}
      >
        <RefreshCcw className={`${AllAreaLoading && "text-primary transition-all animate-pulse"}`} />

      </Button>

    </>
  );
};

export default ParkingAreas;
