import { User } from "./User";

interface ChannelMember {
    channelId: string,
    profileId: string,
    profile: User
}

export interface ChannelType {
    id: string,
    name: string,
    image: string,
    ownerId: string,
    createdAt: string,
    updatedAt: string,
    members: ChannelMember[]
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
    chatType: "channel" | "conversation",
    apiUrl: string,
    paramKey: "channelId" | "conversationId",
    channelData: ChannelType
    profile: User
}
export interface ChatHeaderProps {
    chatType: "channel" | "conversation",
    channelData: ChatData
    profile: User
}