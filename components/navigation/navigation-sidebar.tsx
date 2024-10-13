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
import { ConversationType } from "@/types/Channel";
import GroupNavbar from "../group-navbar/group-navbar";
import DefaultSidebar from "./default-sidebar";

interface SidebarProps {
    profile: User
}

const NavigationSidebar: FC<SidebarProps> = ({ profile }) => {
    const [hovered, setHovered] = useState<boolean>(false)
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>('')
    const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false)
    const channels = profile?.channels

    const allChats = [
        ...(profile?.channels || []).map(channel => ({ ...channel, type: 'channel' })),
        ...(profile?.conversationsReceived || []).map((conversation: ConversationType) => ({ ...conversation, type: 'conversation' })),
        ...(profile?.conversationsInitiated || []).map((conversation: ConversationType) => ({ ...conversation, type: 'conversation' })),
    ];
    const conversations = [
        ...(profile?.conversationsReceived || []).map((conversation: ConversationType) => ({ ...conversation, type: 'conversation' })),
        ...(profile?.conversationsInitiated || []).map((conversation: ConversationType) => ({ ...conversation, type: 'conversation' })),
    ]
    const [isFirstRender, setIsFirstRender] = useState(true);
    const convMemberNotCurrent = conversations
        .filter((conv) => conv.memberOneId === profile.id || conv.memberTwoId === profile.id)
        .map((conv) => (conv.memberOneId === profile.id ? conv.memberTwo : conv.memberOne));
    
    useEffect(() => {
        setIsFirstRender(false);
    }, []);
    if (!channels) return null

    const navbarComponents = {
        search: (
            <>
                <SearchChatsInput
                    isFirstRender={isFirstRender}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                />
                <SearchNavbar profile={profile} setIsSearching={setIsSearching} searchValue={searchValue} />
            </>
        ),
        createGroup: <GroupNavbar usersToInvite={convMemberNotCurrent} setIsCreatingGroup={setIsCreatingGroup} />,
        default: <DefaultSidebar
            isFirstRender={isFirstRender}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            allChats={allChats}
            profile={profile}
            setIsCreatingGroup={setIsCreatingGroup}
            hovered={hovered}
        />,
    };
    const getCurrentNavbar = () => {
        if (isSearching) return navbarComponents.search;
        if (isCreatingGroup) return navbarComponents.createGroup;
        return navbarComponents.default;
    };

    return (
        <div
            className="space-y-4 flex flex-col h-full text-primary w-full bg-[rgb(33,33,33)] border-r-[#303030] border-r border-solid py-3 relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <AnimatePresence>
                {getCurrentNavbar()}
            </AnimatePresence>
        </div>
    );
}

export default NavigationSidebar