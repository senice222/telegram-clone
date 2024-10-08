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

      if (id) {
        await axiosInstance.post(`/api/user/online/${id}`)
        console.log(`User ${id} connected`);

        socket.on("disconnect", async () => {
          await axiosInstance.post(`/api/user/online/${id}`)
          console.log(`User ${id} disconnected`);
        });
      }
    });

    res.socket.server.io = io;
  }


  res.status(200).end();
}