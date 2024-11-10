'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Chat from './chat';
import { User } from '@/types/User';
import { axiosInstance } from '@/core/axios';

type ChatTypes = 'channel' | 'conversation' | 'group';
interface ChatProps {
    id: string
    profile: User;
}

const fetchChat = async (chatType: string, channelId: string) => {
    const endpointMap: Record<string, string> = {
        'channel': `/api/channel/${channelId}`,
        'conversation': `/api/conversation/${channelId}`,
        'group': `/api/group/${channelId}`,
    };

    const { data } = await axiosInstance.get(endpointMap[chatType]);
    return data;
};

const ChatWrapper: React.FC<ChatProps> = ({ id, profile }) => {
    const channelId = id;
    const chatType = id.startsWith('-1')
        ? 'group'
        : id.startsWith('-')
            ? 'conversation'
            : 'channel';
    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: [channelId],
        queryFn: () => fetchChat(chatType, channelId),
    });
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const chatObj: Record<ChatTypes, JSX.Element> = {
        "channel": (
            <Chat
                chatType="channel"
                channelData={data}
                profile={profile}
                apiUrl="/api/get-channel/messages"
                paramKey="channelId"
            />
        ),
        "conversation": (
            <Chat
                chatType="conversation"
                channelData={data}
                profile={profile}
                apiUrl="/api/get-conversation/messages"
                paramKey="conversationId"
            />
        ),
        "group": (
            <Chat
                chatType="group"
                channelData={data}
                profile={profile}
                apiUrl="/api/get-group/messages"
                paramKey="groupId"
            />
        )
    }
    const CurrentChat = chatObj[data?.type as ChatTypes]
    return (
        <div>
            {CurrentChat}
        </div>
    )
};

export default ChatWrapper;
