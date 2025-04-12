"use client";
import { Button } from "@/components/ui/button";
import { DEFAULT_COORDINATES } from "@/constants/constants";
import { LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { toast } from "sonner";
import { LocationMarkerIcon } from "../icons/icons";

function LocateButton() {
  const map = useMap();
  const [latit, setLatit] = useState<number>(DEFAULT_COORDINATES[0]);
  const [longit, setLongit] = useState<number>(DEFAULT_COORDINATES[1]);
  const [locationloading, setLocationLoading] = useState<boolean>(false);


  function getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }


  const locateUser = async () => {
    if (navigator.geolocation) {
      try {
        setLocationLoading(true);
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;
        setLatit(latitude);
        setLongit(longitude);
        map.setView([latitude, longitude], 10);
      } catch (error) {
        if (error instanceof Error && error.message) {
          toast.error("Error getting Location: " + error.message);
        } else {
          toast.error(`Error getting location`);

        }
      } finally {
        setLocationLoading(false);
      }
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    locateUser();
  }, [])

  return (
    <>
      <Marker position={[latit, longit]} icon={LocationMarkerIcon} >
        <Popup>Location</Popup>
      </Marker>
      <Button
        className="absolute h-10 w-10 cursor-pointer bg-card-foreground hover:text-primary hover:bg-background transition-all duration-500 dark:bg-background rounded-full p-0! m-0! has-[>svg]:px-0! py-0! [&_svg:not([class*='size-'])]:size-8 bottom-4 right-4 z-1000"
        onClick={locateUser}
      >
        <LocateFixed className={`${locationloading && "text-primary transition-all animate-pulse"}`} />

      </Button>
    </>
  );
}

export default LocateButton;