"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useTheme } from "next-themes";
import LocateButton from "./mapComponents/LocationButton";
import ZoomAction from "./MapActions/zoomAction";
import React from "react";


const DEFAULT_POSITION: [number, number] = [-6.792354, 39.208328];
const DEFAULT_ZOOM = 13;


const Map: React.FC<PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme } = useTheme();

  const DEFAULT_TILE_LAYER = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  useEffect(() => {
    setMounted(true);
  }, []);



  if (!mounted) return <Loading />;

  return (
    <>
      <MapContainer boundsOptions={{ padding: [0, 0] }} center={DEFAULT_POSITION} zoom={DEFAULT_ZOOM} minZoom={3} maxZoom={18} scrollWheelZoom={true}
        className="w-full h-full p-0"
      >
        {/* Map */}
        <TileLayer
          className="bg-card"
          attribution='© OpenStreetMap contributors © CARTO'
          url={DEFAULT_TILE_LAYER} />

        {/* Map Controlls */}
        <ZoomAction /> {/* Hook to handle Ctrl+ and Ctrl- zooming */}
        <LocateButton /> {/* Button to locate user */}
        {children}
      </MapContainer>
    </>
  )
}

export default React.memo(Map);