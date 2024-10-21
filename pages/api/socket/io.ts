import { NextApiResponseServerIo } from "@/types";
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";
import { axiosInstance } from "@/core/axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false
    });

    io.on("connection", async (socket) => {
      const id = socket.handshake.query.id;

      socket.on('user_online', async (data) => {
        await axiosInstance.patch(`/api/user/online/${data.id}`, { online: "online" })
        io.emit('user_status_update', { id: data.id, status: "online" });
      });

      socket.on('user_offline', async (data) => {
        await axiosInstance.patch(`/api/user/online/${data.id}`, { online: "last seen recently" })
        io.emit('user_status_update', { id: data.id, status: "last seen recenlty" });
      });

      socket.on('disconnect', async () => {
        await axiosInstance.patch(`/api/user/online/${id}`, { online: "last seen recently" })
      });
    });

    res.socket.server.io = io;
  }


  res.status(200).end();
}