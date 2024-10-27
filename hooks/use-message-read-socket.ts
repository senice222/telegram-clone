import { useSocket } from "@/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  queryKey: string; 
  readKey: string;
}

export const useMessageReadSocket = ({ queryKey, readKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const messageData = JSON.parse(event.data);

        if (messageData.key === readKey) {
          const { messageId, readByUserId } = messageData.data;
          console.log(messageData);
          
          queryClient.setQueryData([queryKey], (oldData: any) => {
              if (!oldData || !oldData.pages) return oldData;
      
              const newData = oldData.pages.map((page: any) => ({
                  ...page,
                  items: page.items.map((item: any) => {
                      if (item.id !== messageId) return item;
      
                      if (item.conversation) {
                          return { ...item, isRead: true };
                      } else {
                          const updatedReadBy = item.readBy
                              ? [...item.readBy, { id: readByUserId }]
                              : [{ id: readByUserId }];
                          return { ...item, readBy: updatedReadBy };
                      }
                  }),
              }));
      
              return {
                  ...oldData,
                  pages: newData,
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
  }, [socket, queryClient, queryKey, readKey]);
};
