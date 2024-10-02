'use client';
// import { currentProfile } from "@/lib/current-profile";
import { UserButton } from "@clerk/nextjs";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import ManageChannels from "../manage-channels";
import ChatItem from "../chats/chat-item";
import SearchChatsInput from "../search/search-chats-input";
import SearchNavbar from "../search/search-navbar";
import { motion, AnimatePresence } from "framer-motion";

const NavigationSidebar = () => {
    const [hovered, setHovered] = useState<boolean>(false)
    const [isSearching, setIsSearching] = useState<boolean>(false)

    return (
        <div
            className="space-y-8 flex flex-col h-full text-primary w-full bg-[rgb(33,33,33)] border-r-[#303030] border-r border-solid py-3 relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <SearchChatsInput isSearching={isSearching} setIsSearching={setIsSearching} />
            <AnimatePresence>
                {
                    isSearching ? (
                        <SearchNavbar />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full text-primary w-full bg-[rgb(33,33,33)] relative"
                        >
                            <ScrollArea className="flex flex-col flex-1 w-full">
                                <div className="p-2 h-full">
                                    <div className='ml-1 p-1'>
                                        <ChatItem />
                                    </div>
                                    <div className='ml-1 p-1'>
                                        <ChatItem />
                                    </div>
                                    <div className='ml-1 p-1'>
                                        <ChatItem />
                                    </div>
                                </div>
                            </ScrollArea>
                            <ManageChannels
                                hovered={hovered}
                            />
                            <div className="flex ml-2 flex-col">
                                <div className="mb-3">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: { avatarBox: "h-[48px] w-[48px]" },
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}

export default NavigationSidebar