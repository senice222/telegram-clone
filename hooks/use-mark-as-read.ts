import { axiosInstance } from "@/core/axios";
import { MessageType } from "@/types/Message";
import { User } from "@/types/User";
import { RefObject, useCallback, useEffect, useRef } from "react";

const markMessageAsRead = async (url: string, recipientId: string) => {
    try {
        console.log(recipientId)
        await axiosInstance.put(url, { recipientId });
    } catch (e) {
        console.log(e);
    }
};

const useMarkAsReadOnScroll = (
    data: any,
    otherUsers: User[],
    profile: User,
    chatRef: RefObject<HTMLDivElement>
) => {
    const observer = useRef<IntersectionObserver>();

    const markAsRead = useCallback(
        (entries: any) => {
            entries.forEach((entry: any) => {
                if (entry.isIntersecting) {
                    const messageId = entry.target.id;
                    const message = data.pages.flatMap((page: any) => page.items).find((msg: MessageType) => msg.id === messageId);
    
                    let url;
                    if (message.conversation) {
                        url = `/api/messages/${messageId}/markAsRead`;
                    } else {
                        url = `/api/messages-group/${messageId}/markAsRead`;
                    }
    
                    otherUsers.forEach((otherUser) => {
                        const isMessageRead = message.conversation
                            ? message.isRead
                            : message.readBy?.some((user: User) => user.id === otherUser.id);
    
                        if (!isMessageRead && message.memberId !== profile.id) {
                            markMessageAsRead(url, otherUser.id); 
                        }
                    });
                }
            });
        },
        [data, otherUsers, profile.id]
    );

    // useEffect(() => {
    //     if (data && data.pages) {
    //         const firstUnreadMessage = data.pages
    //             .flatMap((page: any) => page.items)
    //             .find((msg: MessageType) =>
    //                 !msg.isRead
    //                     ? true
    //                     : !msg.readBy?.some((user: User) => user.id === profile.id)
    //             );
            
    //         if (firstUnreadMessage && chatRef.current) {
    //             const messageElement = document.getElementById(firstUnreadMessage.id);
    //             messageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    //         }
    //     }
    // }, [data, profile.id]);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(markAsRead, {
            threshold: 0.5,
        });

        const messageElements = document.querySelectorAll(".message");
        messageElements.forEach((el) => observer.current?.observe(el));

        return () => observer.current?.disconnect();
    }, [data, markAsRead]);
};

export default useMarkAsReadOnScroll;
