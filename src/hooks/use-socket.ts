import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "@/utils/socket";
import { useAuthContext } from "@/context/auth-context";

export const useSocket = () => {
    const { authUser } = useAuthContext();
  const [socket, setSocket] = useState<typeof Socket | undefined>(undefined);

  useEffect(() => {
    if (authUser?._id) {
      const s = getSocket(authUser._id);
      setSocket(s);
    }
  }, [authUser]);

  return socket;
};
