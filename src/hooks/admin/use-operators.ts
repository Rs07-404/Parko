import { IUser } from "@/interfaces/IUser";
import { useEffect, useState} from "react";


export function useAllOperators() {
  const [allOperators, setAllOperators] = useState<IUser[] | null>(null);
  const [AllOperatorsLoading, setAllOperatorsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllOperators = async () => {
    try {
      setAllOperatorsLoading(true);
      setError(null);

      const res = await fetch("/api/user/operators");
      if (!res.ok) throw new Error(`Failed to fetch operators: ${res.statusText}`);

      const data: IUser[] = await res.json();
      setAllOperators(data);
    } catch (err) {
      console.error("Error fetching all operators:", err);
      setError((err as Error).message);
    } finally {
      setAllOperatorsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOperators();
  }, []);

  return {
    allOperators,
    AllOperatorsLoading,
    fetchAllOperators,
    error, // optional: in case you want to show errors
  };
}
