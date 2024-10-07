import { ChannelType } from "./Channel"

export interface User {
    id: string,
    userId: string,
    name: string,
    imageUrl: string,
    email: string,
    createdAt: string,
    channels: [{
        channelId: string,
        profileId: string,
        channel: ChannelType
    }]
}