import { useSocket } from "@/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            try {
                const messageData = JSON.parse(event.data);
                console.log(messageData);
                if (messageData.key === updateKey) {
                    const message = messageData.data;
                    queryClient.setQueryData([queryKey], (oldData: any) => {
                        if (!oldData || !oldData.pages || oldData.length === 0) {
                            return oldData;
                        }
                        const newData = oldData.pages.map((page: any) => {
                            return {
                                ...page,
                                items: page.items.map((item: any) => {
                                    if (item.id === message.id) {
                                        return message;
                                    }
                                    return item;
                                })
                            };
                        });
                        return {
                            ...oldData,
                            pages: newData
                        };
                    });
                }

                if (messageData.key === addKey) {
                    const message = messageData.data;
                    queryClient.setQueryData([queryKey], (oldData: any) => {
                        if (!oldData || !oldData.pages || oldData.length === 0) {
                            return {
                                pages: [{
                                    items: [message]
                                }]
                            };
                        }
                        const newData = [...oldData.pages];
                        
                        const newCategorizedMessages = newData[0].categorizedMessages;

                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                        if (message.files) {
                            let parsedFiles;

                            if (typeof message.files === "string") {
                                try {
                                    parsedFiles = JSON.parse(message.files); 
                                } catch (error) {
                                    console.error("Error parsing JSON", error);
                                }
                            } else {
                                parsedFiles = message.files; 
                            }

                            if (parsedFiles?.type === "imgs") {
                                newCategorizedMessages.media.push(message);
                            } else if (parsedFiles?.type === "files") {
                                newCategorizedMessages.files.push(message);
                            }
                        }

                        if (urlRegex.test(message.content)) {
                            newCategorizedMessages.links.push(message);
                        }
                        newData[0] = {
                            ...newData[0],
                            categorizedMessages: newCategorizedMessages,
                            items: [
                                message,
                                ...newData[0].items
                            ]
                        };

                        return {
                            ...oldData,
                            pages: newData
                        };
                    });
                }
            } catch (error) {
                console.error("Ошибка при обработке сообщения:", error);
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket, queryClient, addKey, updateKey, queryKey]);
};
