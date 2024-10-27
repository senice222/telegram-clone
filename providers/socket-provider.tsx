"use client"
import { axiosInstance } from "@/core/axios";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
    socket: WebSocket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children, id }: { children: React.ReactNode, id: string }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const socketInstance = new WebSocket('ws://localhost:5000/api/socket/io');

        socketInstance.onopen = () => {
            socketInstance.send(JSON.stringify({ method: 'register', data: { id } }));
            setIsConnected(true);
        };

        socketInstance.onclose = () => {
            socketInstance.send(JSON.stringify({ method: 'user_offline', data: { id } }));
            setIsConnected(false);
        };

        socketInstance.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.method === 'user_status_update') {
                const { id, status } = message.data;    
                console.log(`User ${id} status updated to ${status}`);

                queryClient.setQueryData(['allChats'], (oldChats: any) => {
                    if (!oldChats) return [];

                    return oldChats.map((chat: any) => {
                        const otherUser = chat.type === "conversation"
                            ? chat.memberOne.id === id ? chat.memberOne : chat.memberTwo
                            : null;

                        if (!otherUser || otherUser.id !== id) return chat;

                        return {
                            ...chat,
                            memberOne: chat.memberOne.id === otherUser.id
                                ? { ...chat.memberOne, online: status }
                                : chat.memberOne,
                            memberTwo: chat.memberTwo.id === otherUser.id
                                ? { ...chat.memberTwo, online: status }
                                : chat.memberTwo,
                        };
                    });
                });
            }
        };

        // Обработка ошибок соединения
        socketInstance.onerror = (error) => {
            console.log("WebSocket error:", error);
        };

        setSocket(socketInstance);

        return () => {
            socketInstance.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}
