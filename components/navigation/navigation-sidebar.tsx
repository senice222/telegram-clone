'use client';
import { UserButton } from "@clerk/nextjs";
import { ScrollArea } from "../ui/scroll-area";
import { FC, useEffect, useState } from "react";
import ManageChannels from "../manage-channels";
import SearchChatsInput from "../search/search-chats-input";
import SearchNavbar from "../search/search-navbar";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/types/User";
import { useSocket } from '@/providers/socket-provider';
import ChatItem from "../chats/chat-item";

interface SidebarProps {
    profile: User
}

const NavigationSidebar: FC<SidebarProps> = ({ profile }) => {
    const [hovered, setHovered] = useState<boolean>(false)
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>('')
    const channels = profile?.channels

    const allChats = [
        ...(profile?.channels || []).map(channel => ({ ...channel, type: 'channel' })),
        ...(profile?.conversationsReceived || []).map((conversation: any) => ({ ...conversation, type: 'conversation' })),
        ...(profile?.conversationsInitiated || []).map((conversation: any) => ({ ...conversation, type: 'conversation' })),
    ];
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        setIsFirstRender(false);
    }, []);
    if (!channels) return null

    return (
        <div
            className="space-y-4 flex flex-col h-full text-primary w-full bg-[rgb(33,33,33)] border-r-[#303030] border-r border-solid py-3 relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <SearchChatsInput
                isFirstRender={isFirstRender}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
            />
            <AnimatePresence>
                {
                    isSearching ? (
                        <SearchNavbar profile={profile} setIsSearching={setIsSearching} searchValue={searchValue} />
                    ) : (
                        <motion.div
                            initial={isFirstRender ? false : { opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full text-primary w-full bg-[rgb(33,33,33)] relative"
                        >
                            <ScrollArea className="flex flex-col flex-1 w-full">
                                <div className="p-2 h-full">
                                    {allChats.length > 0 ? (
                                        allChats.map((item, index) => (
                                            <ChatItem
                                                key={index}
                                                type={item.type}
                                                profile={profile}
                                                data={item.type === "channel" ? item.channel : item}
                                                setIsSearching={setIsSearching}
                                            />
                                        ))
                                    ) : (
                                        <div className='flex flex-col gap-3 select-none h-full items-center justify-center'>
                                            <p className='text-[#686c72]'>No results</p>
                                            <div className='flex flex-col items-center'>
                                                <p className="text-[#aaaaaa] text-[.875rem]">There were no results.</p>
                                                <p className="text-[#aaaaaa] text-[.875rem]">Try a new search.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="flex ml-2 flex-col">
                                <div className="mb-3">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: { avatarBox: "h-[48px] w-[48px]" },
                                        }}
                                    />
                                </div>
                                <ManageChannels
                                    profile={profile}
                                    hovered={hovered}
                                />
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}

export default NavigationSidebar