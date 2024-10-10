import { ChannelType } from "./Channel"

export interface User {
    id: string,
    userId: string,
    name: string,
    imageUrl: string,
    email: string,
    createdAt: string,
    conversationsReceived: any,
    conversationsInitiated: any,
    type: "user"
    channels: [{
        channelId: string,
        profileId: string,
        channel: ChannelType
    }]
}