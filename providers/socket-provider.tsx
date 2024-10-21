"use client"
import { axiosInstance } from "@/core/axios";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children, id }: { children: React.ReactNode, id: string }) => {
    const [socket, setSocket] = useState<any | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const queryClient = useQueryClient()

    useEffect(() => {
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            query: {
                id
            },
            addTrailingSlash: false
        });
        socketInstance.on("connect", async () => {
            socketInstance.emit('user_online', { id });
            setIsConnected(true);
        });

        socketInstance.on("disconnect", async () => {
            socketInstance.emit('user_offline', { id });
            setIsConnected(false);
        });
        socketInstance.on('user_status_update', (data: { id: string, status: string }) => {
            console.log(`User ${data.id} status updated to ${data.status}`);
            queryClient.setQueryData(['allChats'], (oldChats: any) => {
                if (!oldChats) return [];

                return oldChats.map((chat: any) => {
                    const otherUser = chat.type === "conversation"
                        ? chat.memberOne.id === data.id ? chat.memberOne : chat.memberTwo
                        : null;

                    if (!otherUser || otherUser.id !== data.id) return chat;

                    return {
                        ...chat,
                        memberOne: chat.memberOne.id === otherUser.id
                            ? { ...chat.memberOne, online: data.status }
                            : chat.memberOne,
                        memberTwo: chat.memberTwo.id === otherUser.id
                            ? { ...chat.memberTwo, online: data.status }
                            : chat.memberTwo,
                    };
                });
            });
        });
        socketInstance.on("connect_error", (error: any) => {
            console.log("Error during connection:", error);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}