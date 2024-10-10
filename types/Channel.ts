import { User } from "./User";

export interface ChannelType {
    id: string,
    name: string,
    image: string,
    ownerId: string,
    createdAt: string,
    updatedAt: string,
    members: [{
        channelId: string,
        profileId: string,
    }]
    type: 'channel'
}

export interface ChannelChatProps {
    channelData: ChannelType
    profile: User
}