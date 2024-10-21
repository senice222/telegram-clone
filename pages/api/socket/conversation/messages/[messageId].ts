import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { axiosInstance } from "@/core/axios";


const handler = async (
    req: NextApiRequest,
    res: NextApiResponseServerIo
) => {
    if (req.method !== "POST" && req.method !== "PATCH" && req.method !== "DELETE") {
        return res.status(405).json({message: "Method Not Allowed"});
    }
    try {
        const profile = await currentProfilePages(req)
        const {messageId} = req.query;
        
        const { content, owner } = req.body;

        if (req.method === "PATCH") {
            if (!messageId || !content) {
                return res.status(400).json({ message: "Message ID and new content are required." });
            }
            if (owner !== profile.id) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const {data} = await axiosInstance.patch(`/api/conversation/message/edit/${messageId}`, {
                content
            })
            const conversationKey = `conversation:${data.conversationId}:messages:update`;
            res?.socket?.server?.io.emit(conversationKey, data);
            return res.status(200).json({ message: "Message updated successfully", data });
        }

        if (req.method === "DELETE") {
            if (!messageId) {
                return res.status(400).json({ message: "Message ID and new content are required." });
            }

            const {data} = await axiosInstance.delete(`/api/conversation/message/delete/${messageId}`)
            const conversationKey = `conversation:${data.conversationId}:messages:update`;
            res?.socket?.server?.io.emit(conversationKey, data);

            return res.status(200).json({ message: "Message updated successfully", data });
        }
    } catch (e) {
        console.log(e)
    }
}

export default handler