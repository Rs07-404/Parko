import { useEffect } from "react";
import { useMap } from "react-leaflet";

function ZoomAction() {
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

export default ZoomAction;