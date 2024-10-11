import { ChannelType } from "./Channel";

export interface MessageI {
    id: number;
    author: string;
    avatar: string;
    text: string;
    isOwn: boolean;
    time: string;
}

export interface MessageType {
    id: string,
    content: string,
    fileUrl: string,
    channelId: string
    deleted: boolean
    channel: ChannelType
    createdAt: Date
    updatedAt: Date
    isOwn: boolean
    memberId: string
}