import { useSocket } from "@/providers/socket-provider";
import { Group } from "@/types/Group";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
    const { socket } = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on(updateKey, (message: any) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.length === 0) {
                    return oldData
                }
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: any) => {
                            if (item.id === message.id) {
                                return message
                            }
                            return item
                        })
                    }
                })
                return {
                    ...oldData,
                    pages: newData
                }
            })
        })

        socket.on(addKey, (message: any) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.length === 0) {
                    return {
                        pages: [{
                            items: [message]
                        }]
                    }
                }
                const newData = [...oldData.pages]
                
                const newCategorizedMessages = newData[0].categorizedMessages

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
                    categorizedMessages : newCategorizedMessages,
                    items: [
                        message,
                        ...newData[0].items
                    ]
                }

                return {
                    ...oldData,
                    pages: newData
                }
            })
        })

        return () => {
            socket.off(updateKey)
            socket.off(addKey)
        }
    }, [socket, queryClient, addKey, updateKey, queryKey])
}