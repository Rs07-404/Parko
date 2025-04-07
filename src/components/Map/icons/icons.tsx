import { createLucideIcon } from "@/utils/createLucideIcon";
import Image from "next/image";
import gpsIcon from "@/assets/mapMarkers/gps.png";
import markerPending from "@/assets/mapMarkers/mapMarkerPending.png";
import markerDefault from "@/assets/mapMarkers/mapMarkerDefault.png";

// ParkingSpot Indicator imports
import spotAvailable from "@/assets/mapMarkers/SpotAvailable.png";
import spotBusy from "@/assets/mapMarkers/SpotBusy.png";
import spotBooked from "@/assets/mapMarkers/SpotBooked.png"


// Location Markers
export const DefaultMarkerIcon = createLucideIcon(<Image height={32} width={32} alt="gps_pointer" src={markerDefault} />);
export const LocationMarkerPendingIcon = createLucideIcon(<Image height={32} width={32} alt="marker" src={markerPending} />)
export const LocationMarkerIcon = createLucideIcon(<Image height={32} width={32} alt="gps_pointer" src={gpsIcon} />);

// Parking Spot Indicators
export const SpotAvailable = createLucideIcon(<Image height={32} width={32} alt="indicator" src={spotAvailable} />)
export const SpotBusy = createLucideIcon(<Image height={32} width={32} alt="indicator" src={spotBusy} />)
export const SpotBooked = createLucideIcon(<Image height={32} width={32} alt="indicator" src={spotBooked} />)