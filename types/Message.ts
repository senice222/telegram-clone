import { ChannelType } from "./Channel";
import { User } from "./User";

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
    files: {
        type: string,
        fileUrls: String[]
    },
    channelId: string
    deleted: boolean
    channel: ChannelType
    createdAt: Date
    updatedAt: Date
    isOwn: boolean,
    replyToMessage: MessageType | null
    memberId: string
    ownerProfile: User
}