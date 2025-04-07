import { useEffect, useState, useCallback } from "react";

type Coordinates = [number, number];

export interface ParkingSpot {
  _id: string;
  number: string;
  status: "available" | "occupied";
  // Add other fields as needed
}

export interface ParkingArea {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: Coordinates;
  };
  parkingSpots: ParkingSpot[];
  // Add other fields as needed
}

export function useNearbyParkingAreas(userCoords: Coordinates) {
  const [parkingAreas, setParkingAreas] = useState<ParkingArea[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = useCallback(async (coords: Coordinates) => {
    setLoading(true);
    setError(null);

    const tryFetch = async (radius: number): Promise<ParkingArea[] | null> => {
      try {
        const res = await fetch("/api/parking/area/withspots/find-within-radius", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coordinates: coords, radius }),
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: ParkingArea[] = await res.json();
        return data.length > 0 ? data : null;
      } catch (err) {
        console.error("Error in tryFetch:", err);
        setError((err as Error).message);
        return null;
      }
    };

    const results = (await tryFetch(1)) || (await tryFetch(5));
    setParkingAreas(results);
    setLoading(false);
    return results;
  }, []);

  useEffect(() => {
    if (userCoords?.length === 2) {
      fetchAreas(userCoords);
    } else {
      setLoading(false);
      setError("Invalid coordinates provided.");
    }
  }, [userCoords, fetchAreas]);

  return {
    parkingAreas,
    loading,
    error,
    refetch: () => fetchAreas(userCoords), // manually trigger fetch
  };
}
