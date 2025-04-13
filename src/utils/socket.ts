import io, { Socket } from "socket.io-client";

let socket: typeof Socket | undefined = undefined;

export const initSocket = (userId: string): typeof Socket => {
    if (!socket) {
        socket = io({
            path: "/api/socket",
            query: { userId },
        });

        if (socket) {
            socket.on("connect", () => {
                console.log("🔗 Socket connected:", socket?.id);
            });

            socket.on("disconnect", () => {
                console.log("🔌 Socket disconnected");
            });
        }
    }

    return socket;
};

export const getSocket = (userId: string): typeof Socket | undefined => socket ?? initSocket(userId);   
