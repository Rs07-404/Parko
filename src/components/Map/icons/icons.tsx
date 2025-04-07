import { createLucideIcon } from "@/utils/createLucideIcon";
import Image from "next/image";
import gpsIcon from "@/assets/gps.png";
import markerPending from "@/assets/mapMarkerPending.png";
import markerDefault from "@/assets/mapMarkerDefault.png";

export const DefaultMarkerIcon = createLucideIcon(<Image height={32} width={32} alt="gps_pointer" src={markerDefault} />);
export const LocationMarkerPendingIcon = createLucideIcon(<Image height={32} width={32} alt="marker" src={markerPending} />)
export const LocationMarkerIcon = createLucideIcon(<Image height={32} width={32} alt="gps_pointer" src={gpsIcon} />);
