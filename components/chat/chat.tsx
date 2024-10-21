"use client";
import React, { ElementRef, FC, useEffect, useRef, useState } from "react";
import SendMessage from "./send-message/send-message";
import Header from "./header";
import RightPanel from "./right-panel";
import { ChatProps } from "@/types/Channel";
import { useChatQuery } from "@/hooks/use-channel-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { Loader2 } from "lucide-react";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { isChannel, isConversation, isGroup } from "@/lib/utils";
import { Member } from "@/types/Group";
import { ConversationType } from "@/types/Conversation";
import Pending from "./pending/pending";
import Error from "./error/error";
import MessageList from "./messages/message-list";

const Chat: FC<ChatProps> = ({ chatType, paramKey, apiUrl, channelData, profile }) => {
    const queryKey = `${chatType}:${channelData?.id}`
    const addKey = `${chatType}:${channelData?.id}:messages`
    const updateKey = `${chatType}:${channelData?.id}:messages:update`
   
    const bottomRef = useRef<ElementRef<"div">>(null)
    const chatRef = useRef<ElementRef<"div">>(null)
    const headerRef = useRef<HTMLDivElement | null>(null);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const paramValue = channelData?.id

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })
    useChatSocket({ queryKey, addKey, updateKey })
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0].items?.length ?? 0
    })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                menuRef.current &&
                !menuRef.current.contains(target) &&
                headerRef.current &&
                !headerRef.current.contains(target)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleHeaderClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    if (status === "pending") return <Pending />
    if (status === "error" || !data) return <Error />

    return (
        <div className="w-full h-[100vh] flex overflow-hidden">
            <div className="w-full h-full flex flex-col">
                <div
                    ref={headerRef}
                    onClick={handleHeaderClick}
                    className={`transition-all duration-300 ${isMenuOpen ? 'w-[calc(100%-25vw)] max-2xl:w-[100%]' : 'w-[100%]'
                        }`}
                >
                    <Header chatType={chatType} profile={profile} channelData={channelData} />
                </div>

                <div className="flex w-full h-full">
                    <div
                        className={`transition-all flex flex-col h-full items-center duration-300 ${isMenuOpen ? 'w-[calc(100%-25vw)] max-2xl:w-[100%]' : 'w-[100%]'
                            }`}
                    >
                        {hasNextPage && (
                            <div className="flex justify-center">
                                {isFetchingNextPage ? (
                                    <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                                ) : (
                                    <button
                                        onClick={() => fetchNextPage()}
                                        className="my-4 text-xs text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                                    >
                                        Load previous messages..
                                    </button>
                                )}
                            </div>
                        )}

                        <div
                            className="w-[728px] max-lg:w-[90%] h-full overflow-auto"
                            ref={chatRef}
                        >
                            <MessageList data={data} channelData={channelData} profile={profile} bottomRef={bottomRef} />
                            {
                                isChannel(channelData) && profile.id === channelData.ownerId ? (
                                    <SendMessage
                                        id={channelData.id}
                                        apiUrl='channel/messages'
                                    />
                                ) : isGroup(channelData) && channelData.members.some((item: Member) => item.memberId === profile.id) ? (
                                    <SendMessage
                                        id={channelData.id}
                                        apiUrl='group/messages'
                                    />
                                ) : isConversation(channelData) && (
                                    <SendMessage
                                        id={(channelData as ConversationType).id}
                                        apiUrl={'conversation/messages'}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <RightPanel
                menuRef={menuRef}
                channelData={channelData}
                isMenuOpen={isMenuOpen}
                setMenuOpen={setIsMenuOpen}
                profile={profile}
                categorizedMessages={data?.pages?.[0].categorizedMessages}
            />
        </div>
    );
};

export default Chat;
