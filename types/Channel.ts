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
        profile: User
    }]
    type: 'channel'
}

export type ConversationType = {
    memberOne: User;
    memberTwo: User;
    id: string;
    hasConversation?: boolean;
    type: 'conversation';
}


export type ChatData = ChannelType | ConversationType

export interface Channel {
    channelId: string,
    profileId: string,
    type: "channel",
    channel: ChannelType
}

export interface ChatProps {
    key: "channel" | "conversation",
    apiUrl: string,
    paramKey: "channelId" | "conversationId",
    channelData: ChannelType
    profile: User
}
export interface ChatHeaderProps {
    key: "channel" | "conversation",
    channelData: ChatData
    profile: User
}