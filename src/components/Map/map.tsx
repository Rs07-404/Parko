"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useTheme } from "next-themes";
import LocateButton from "./mapComponents/LocationButton";
import ZoomAction from "./MapActions/zoomAction";


const DEFAULT_POSITION: [number, number] = [-6.792354, 39.208328];
const DEFAULT_ZOOM = 13;


const Map = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme } = useTheme();
  const DEFAULT_TILE_LAYER = theme === "dark" ?
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    : " https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading />;

  return (
    <MapContainer boundsOptions={{ padding: [0, 0] }} center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM} minZoom={3} scrollWheelZoom={true}
      className="w-full h-full p-0"
    >
      {/* Map */}
      <TileLayer 
      attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      url={DEFAULT_TILE_LAYER} />

      {/* Map Controlls */}
      <ZoomAction /> {/* Hook to handle Ctrl+ and Ctrl- zooming */}
      <LocateButton /> {/* Button to locate user */}
    </MapContainer>
  )
}

export default Map;