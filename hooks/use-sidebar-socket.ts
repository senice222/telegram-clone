import { useSocket } from "@/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type SidebarSocketProps = {
    lastMessageUpdateKey: string;
    groupKey: string;
};

export const useSidebarSocket = ({ lastMessageUpdateKey, groupKey }: SidebarSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            const messageData = JSON.parse(event.data);
            if (messageData.key === groupKey) {
                const newGroup = messageData.newGroup;
                queryClient.setQueryData(['allChats'], (oldData: any) => [
                    newGroup,
                    ...(oldData || []),
                ]);
            }

            if (messageData.key === lastMessageUpdateKey) {
                const update = messageData.data;
                queryClient.setQueryData(['allChats'], (chats: any) => {
                    if (!chats) return [];
                    const updatedChat = chats.find((chat: any) =>
                        chat.id === update.conversationId ||
                        chat.id === update.channelId ||
                        chat.id === update.groupId
                    );
                    if (!updatedChat) return chats;
                    const otherChats = chats.filter((chat: any) => chat.id !== updatedChat.id);
                    return [{ ...updatedChat, lastMessage: update.lastMessage }, ...otherChats];
                });
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket, queryClient, lastMessageUpdateKey, groupKey]);
};
