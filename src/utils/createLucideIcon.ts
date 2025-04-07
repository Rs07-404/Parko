import { JSX } from "react";
import * as L from "leaflet"; // Import Leaflet library
import { renderToString } from "react-dom/server";

export const createLucideIcon = (iconComponent: JSX.Element) => {
    return new L.DivIcon({
      className: "custom-marker",
      html: renderToString(iconComponent),
      iconSize: [30, 30], // Adjust size if needed
      iconAnchor: [15, 30], // Center the icon properly
      popupAnchor: [0, -30], // Position the popup correctly
    });
};