import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

const users = new Map<string, string>(); // userId -> socketId

export default function handler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO server");

    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId as string;
      console.log(`✅ User connected: ${userId}`);

      if (userId) users.set(userId, socket.id);

      socket.on("private-message", ({ to, message }) => {
        const recipientSocketId = users.get(to);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive-private-message", {
            from: userId,
            message,
          });
        }
      });

      socket.on("disconnect", () => {
        if (userId) users.delete(userId);
        console.log(`❌ Disconnected: ${userId}`);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
