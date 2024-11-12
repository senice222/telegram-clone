import { useSocket } from "@/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type GroupUpdateSocketProps = {
    groupKey: string;
};

export const useGroupUpdateSocket = ({ groupKey }: GroupUpdateSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleGroupUpdate = (event: MessageEvent) => {
            try {
                const messageData = JSON.parse(event.data);

                if (messageData.key === groupKey) {
                    const updatedGroup = messageData.group;
                    queryClient.invalidateQueries({ queryKey: [updatedGroup.id] });
                }
            } catch (error) {
                console.error("Ошибка при обработке обновления группы:", error);
            }
        };

        socket.addEventListener('message', handleGroupUpdate);

        return () => {
            socket.removeEventListener('message', handleGroupUpdate);
        };
    }, [socket, queryClient, groupKey]);
};
