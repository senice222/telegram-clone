import { useSocket } from "@/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type GroupMemberSocketProps = {
    groupMemberKey: string;  // Ключ для добавления пользователя
    queryKey: string;      // Ключ для кэширования всех чатов
};

export const useGroupMemberSocket = ({ groupMemberKey, queryKey }: GroupMemberSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }
        const handleMemberAdd = (event: MessageEvent) => {
            try {
                const messageData = JSON.parse(event.data);
                console.log("group member data", messageData);

                if (messageData.key === groupMemberKey) {
                    const newMembers = messageData.member;
                    const groupId = messageData.group.id;
                    const newGroup = messageData.group;

                    queryClient.setQueryData([groupId], (oldData: any) => {
                        if (!oldData || !Array.isArray(oldData)) {
                            return oldData; 
                        }

                        const newData = oldData.map((chat: any) => {
                            if (chat.id === groupId) {
                                const existingMembers = chat.members || [];
                                const uniqueNewMembers = newMembers.filter(
                                    (newMember: any) => !existingMembers.some(
                                        (existingMember: any) => existingMember.id === newMember.id
                                    )
                                );
                                return {
                                    ...chat,
                                    members: [...existingMembers, ...uniqueNewMembers]
                                };
                            }
                            return chat;
                        });

                        return newData;
                    });

                    newMembers.forEach((member: any) => {
                        queryClient.setQueryData(['allChats', member.memberId], (oldData: any) => {

                            if (!oldData || !Array.isArray(oldData)) {
                                return [newGroup];
                            }
                            const isGroupAlreadyAdded = oldData.some(
                                (chat: any) => chat.id === groupId
                            );
                            if (isGroupAlreadyAdded) {
                                return oldData;
                            }
                            return [newGroup, ...oldData];
                        });
                    });
                }

            } catch (error) {
                console.error("Ошибка при обработке добавления пользователя в группу:", error);
            }
        };


        socket.addEventListener('message', handleMemberAdd);

        return () => {
            socket.removeEventListener('message', handleMemberAdd);
        };
    }, [socket, queryClient, groupMemberKey, queryKey]);
};
