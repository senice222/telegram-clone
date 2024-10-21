import { useSocket } from "@/providers/socket-provider";
import { Group } from "@/types/Group";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type SidebarSocketProps = {
    lastMessageUpdateKey: string
    groupKey: string
}


export const useSidebarSocket = ({ lastMessageUpdateKey, groupKey }: SidebarSocketProps) => {
    const { socket } = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on(groupKey, (newGroup: any) => {
            queryClient.setQueryData(['allChats'], (oldData: any) => [
                newGroup,
                ...(oldData || []),
            ]);
        });
        socket.on(lastMessageUpdateKey, (update: any) => {
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
        });

        return () => {
            socket.off(lastMessageUpdateKey)
            socket.off(groupKey);
        }
    }, [socket, queryClient, lastMessageUpdateKey])
}