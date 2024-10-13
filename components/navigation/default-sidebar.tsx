import React, { Dispatch, FC, SetStateAction } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import {motion} from 'framer-motion'
import SearchChatsInput from '../search/search-chats-input'
import ChatItem from '../chats/chat-item'
import { UserButton } from '@clerk/nextjs'
import ManageChannels from '../manage-channels'
import { User } from '@/types/User'

interface DefaultSidebarProps {
    isFirstRender: boolean
    searchValue: string
    setSearchValue: Dispatch<SetStateAction<string>>
    isSearching: boolean
    setIsSearching: Dispatch<SetStateAction<boolean>>
    allChats: { type: "conversation" | "channel"; channel?: any; [key: string]: any }[]
    profile: User
    setIsCreatingGroup: Dispatch<SetStateAction<boolean>>
    hovered: boolean
}

const DefaultSidebar: FC<DefaultSidebarProps> = ({
    isFirstRender,
    searchValue,
    setSearchValue,
    isSearching,
    setIsSearching,
    allChats,
    profile,
    setIsCreatingGroup,
    hovered,
}) => {
    return (
        <>
            <SearchChatsInput
                isFirstRender={isFirstRender}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
            />
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
                            <div className="flex flex-col gap-3 select-none h-full items-center justify-center">
                                <p className="text-[#686c72]">No results</p>
                                <div className="flex flex-col items-center">
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
                        setIsCreatingGroup={setIsCreatingGroup}
                        profile={profile}
                        hovered={hovered}
                    />
                </div>
            </motion.div>
        </>
    )
}

export default DefaultSidebar