import { axiosInstance } from "@/core/axios";
import { currentProfilePages } from "@/lib/currentProfilePages";
import {NextApiResponseServerIo} from "@/types";
import {NextApiRequest} from "next";
import qs from 'query-string'

const handler = async (
    req: NextApiRequest,
    res: NextApiResponseServerIo
) => {
    if (req.method !== "POST") {
        return res.status(405).json({message: "Method Not Allowed"});
    }
    try {
        const currentProfile = await currentProfilePages(req)
        const {channelId, content} = req.body;

        const url = qs.stringifyUrl({
            url: `/api/channel/message`,
            query: {
                profileId: currentProfile.id,
                channelId
            },
        })

        const {data} = await axiosInstance.patch(url, {content})
        const channelKey = `channel:${data.channelId}:messages`

        res?.socket?.server?.io.emit(channelKey, data)

        return res.status(200).json(data)
    } catch (e) {
        console.log("[MESSAGES POST]", e);
        return res.status(500).json({message: "Internal error"});
    }
};

export default handler