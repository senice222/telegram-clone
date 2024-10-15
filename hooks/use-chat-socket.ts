import {useSocket} from "@/providers/socket-provider";
import {useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string
}


export const useChatSocket = ({addKey, updateKey, queryKey}: ChatSocketProps) => {
    const {socket} = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on('group.created', (newGroup: any) => {
            queryClient.setQueryData(['groups'], (oldData: any) => [
                newGroup,
                ...(oldData || []),
            ]);
        });
        socket.on(addKey, (message: any) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData ||!oldData.pages || oldData.length === 0) {
                    return {
                        pages: [{
                            items: [message]
                        }]
                    }
                }
                console.log("UPDATE")
                const newData = [...oldData.pages]
                newData[0] = {
                    ...newData[0],
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
            socket.off('group.created');
        }
    }, [socket, queryClient, addKey, updateKey, queryKey])
}