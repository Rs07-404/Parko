
import { IReservation} from "@/interfaces/Generic/IReservation";
import { useEffect, useState, useCallback } from "react";


export function useAllReservations() {
  const [reservations, setReservations] = useState<IReservation[] | null>(null);
  const [reservationsLoading, setReservationsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllReservations = useCallback(async () => {
    try {
      setReservationsLoading(true);
      setError(null);

      const res = await fetch("/api/reservation/get-by-session",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(`Failed to fetch reservations: ${responseData.message}`);

      const data: IReservation[] = responseData.data;
      setReservations(data);
    } catch (err) {
      console.error("Error fetching all reservations:", err);
      setError((err as Error).message);
    } finally {
      setReservationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReservations();
  }, [fetchAllReservations]);

  return {
    reservations,
    reservationsLoading,
    fetchAllReservations,
    error, // optional: in case you want to show errors
  };
}
