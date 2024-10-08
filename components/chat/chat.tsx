"use client";
import React, {ElementRef, FC, Fragment, useEffect, useRef, useState} from "react";
import SendMessage from "./send-message";
import Header from "./header";
import RightPanel from "./right-panel";
import {MessageI, MessageType} from "@/types/Message";
import {ChannelChatProps} from "@/types/Channel";
import {useChatQuery} from "@/hooks/use-channel-query";
import Message from "@/components/chat/messages/message";
import {useChatSocket} from "@/hooks/use-chat-socket";
import {Loader2, ServerCrash} from "lucide-react";
import {useChatScroll} from "@/hooks/use-chat-scroll";

const Chat: FC<ChannelChatProps> = ({channelData, profile}) => {
    const queryKey = `channel:${channelData.id}`
    const addKey = `channel:${channelData.id}:messages`
    const updateKey = `chat:${channelData.id}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)
    const headerRef = useRef<HTMLDivElement | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const apiUrl = '/api/get-channel/messages'
    const paramKey = "channelId" // | "conversationId";
    const paramValue = channelData.id

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useChatQuery({
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
    console.log(data)
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

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
            </div>
        )
    }

    if (status === "error" || !data) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong!</p>
            </div>
        )
    }

    return (
        <div ref={chatRef} className="w-full h-[100vh] flex">
            <div className="w-full h-[100vh] flex flex-col">
                <div
                    ref={headerRef}
                    onClick={handleHeaderClick}
                    className={`transition-all duration-300 ${isMenuOpen ? "w-[calc(100%-25vw)] max-2xl:w-[100%]" : "w-[100%]"
                    }`}
                >
                    <Header profile={profile} channelData={channelData}/>
                </div>

                <div className="flex w-full h-full">
                    <div
                        className={`transition-all flex flex-col h-full items-center duration-300 ${isMenuOpen ? "w-[calc(100%-25vw)] max-2xl:w-[100%]" : "w-[100%]"}`}
                    >
                        {hasNextPage && (
                            <div className='flex justify-center'>
                                {
                                    isFetchingNextPage ? (
                                        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                                    ) : (
                                        <button onClick={() => fetchNextPage()} className="my-4 text-xs text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                                            Load previous messages..
                                        </button>
                                    )
                                }
                            </div>
                        )}
                        <div className="w-[728px] max-lg:w-[90%] h-[calc(100%-20px)] max-[1500px]:bg-sky-300">
                            <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
                                {/* тут сообщения */}
                                {/*{data.pages[0].items.map((message: MessageType) => (*/}
                                {/*    <Message key={message.id} message={message} channel={channelData ? channelData : null} />*/}
                                {/*))}*/}
                                {data?.pages?.map((group, i) => (
                                    <Fragment key={i}>
                                        {group.items.map((message: MessageType) => (
                                            <Message
                                                key={message.id}
                                                message={message}
                                                channel={channelData}
                                            />
                                        ))}
                                    </Fragment>
                                ))}
                                <div ref={bottomRef} />
                            </div>
                            <SendMessage id={channelData.id}/>
                        </div>
                    </div>
                </div>
            </div>

            <RightPanel
                menuRef={menuRef}
                channelData={channelData}
                isMenuOpen={isMenuOpen}
                setMenuOpen={setIsMenuOpen}
            />
        </div>
    );
};

export default Chat;
