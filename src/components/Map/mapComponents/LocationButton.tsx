import { Button } from "@/components/ui/button";
import { DEFAULT_COORDINATES } from "@/constants/constants";
import { RadarIcon } from "lucide-react";
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { toast } from "sonner";
import { DefaultMarkerIcon } from "../icons/icons";

function LocateButton() {
  const map = useMap();
  const [latit, setLatit] = useState<number>(DEFAULT_COORDINATES[0]);
  const [longit, setLongit] = useState<number>(DEFAULT_COORDINATES[1]);

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatit(latitude); // Update latitude state
          setLongit(longitude); // Update longitude state
          map.setView([latitude, longitude], 10); // Move map to user's location
        },
        (error) => {
          if(error instanceof Error) {toast.error(error.message)}
          else {toast.error("Location access denied or unavailable.");}
          
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  return (
    <>
      <Marker position={[latit, longit]} icon={DefaultMarkerIcon} >
        <Popup>Location</Popup>
      </Marker>
      <Button
        className="absolute h-16 w-16 rounded-full bottom-4 right-4 z-1000"
        onClick={locateUser}
      >
        <RadarIcon className="h-12 w-12" />

      </Button>
    </>
  );
}

export default LocateButton;