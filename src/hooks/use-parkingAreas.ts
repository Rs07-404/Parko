import { useEffect, useState, useCallback } from "react";

export interface IParkingSpot {
  _id: string;
  spotNumber: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [latitude, longitude]
  };
  status: 'available' | 'occupied';
  sensorId?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface IParkingArea {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  parkingSpots: IParkingSpot[];
  // Add more fields if needed
}

export function useAllParkingAreas() {
  const [allParkingAreas, setAllParkingAreas] = useState<IParkingArea[] | null>(null);
  const [AllAreaLoading, setAllAreaLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllParkingAreas = useCallback(async () => {
    try {
      setAllAreaLoading(true);
      setError(null);

      const res = await fetch("/api/parking/area/withspots/");
      if (!res.ok) throw new Error(`Failed to fetch parking areas: ${res.statusText}`);

      const data: IParkingArea[] = await res.json();
      setAllParkingAreas(data);
    } catch (err) {
      console.error("Error fetching all parking areas:", err);
      setError((err as Error).message);
    } finally {
      setAllAreaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllParkingAreas();
  }, [fetchAllParkingAreas]);

  return {
    allParkingAreas,
    AllAreaLoading,
    fetchAllParkingAreas,
    error, // optional: in case you want to show errors
  };
}
