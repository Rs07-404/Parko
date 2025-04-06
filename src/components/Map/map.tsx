"use client";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useTheme } from "next-themes";
import { DefaultMarkerIcon } from "./icons/icons";
import { Button } from "../ui/button";
import { LocateFixed } from "lucide-react";
import { toast } from "sonner";


const DEFAULT_POSITION: [number, number] = [-6.792354, 39.208328];
const DEFAULT_ZOOM = 13;


// Custom Hook to Handle Geolocation
function LocateButton() {
  const map = useMap();
  const [latit, setLatit] = useState<number>(DEFAULT_POSITION[0]);
  const [longit, setLongit] = useState<number>(DEFAULT_POSITION[1]);

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
          toast.error("Location access denied or unavailable.");
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
        className="absolute h-max w-max rounded-full bottom-4 right-4 z-1000"
        onClick={locateUser}
      >
        <LocateFixed size={64} className="w-16 h-16" />

      </Button>
    </>
  );
}

// Custom Hook to Handle Keyboard Zoom
function KeyboardZoom() {
  const map = useMap();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const zoomInValue = 1; // Define a default zoom increment value
      if ((event.ctrlKey || event.metaKey) && (event.key === "=" || event.key === "-")) {
        event.preventDefault(); // Prevent browser zoom

        if (event.key === "=") {
          // Zoom in with some value
          map.zoomIn(zoomInValue + 1); // Zoom in
        }

        if (event.key === "-") {
          map.zoomOut(zoomInValue - 1); // Zoom out
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [map]);

  return null;
}


const Map = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme } = useTheme();
  const DEFAULT_TILE_LAYER = theme === "dark" ?
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading />;

  return (
    <MapContainer boundsOptions={{ padding: [0, 0] }} center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM} minZoom={3} scrollWheelZoom={true}
      className="w-full h-full p-0"
    >
      <TileLayer url={DEFAULT_TILE_LAYER} />
      <Marker position={DEFAULT_POSITION} icon={DefaultMarkerIcon} >
        <Popup>Location</Popup>
      </Marker>
      <KeyboardZoom /> {/* Hook to handle Ctrl+ and Ctrl- zooming */}
      <LocateButton /> {/* Button to locate user */}
      <Button
        className="absolute h-max w-max rounded-full bottom-4 right-4 z-1000"
        onClick={()=>{}}
      >
        <LocateFixed size={64} className="w-16 h-16" />

      </Button>
    </MapContainer>
  )
}

export default Map;