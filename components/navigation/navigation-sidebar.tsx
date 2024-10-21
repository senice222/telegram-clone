'use client';
import { FC, useEffect, useState } from "react";
import SearchChatsInput from "../search/search-chats-input";
import SearchNavbar from "../search/search-navbar";
import { AnimatePresence } from "framer-motion";
import { User } from "@/types/User";
import { ConversationType } from "@/types/Channel";
import GroupNavbar from "../group-navbar/group-navbar";
import DefaultSidebar from "./default-sidebar";
import { useAllChats } from "@/hooks/use-all-chats";
import Pending from "../chat/pending/pending";

interface SidebarProps {
    profile: User
}

const NavigationSidebar: FC<SidebarProps> = ({ profile }) => {
    const [hovered, setHovered] = useState<boolean>(false)
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>('')
    const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false)
    const channels = profile?.channels
    const [isFirstRender, setIsFirstRender] = useState(true);
    const { data: allChats, isLoading } = useAllChats(profile.id);

    useEffect(() => {
        setIsFirstRender(true);
    }, []);
    
    if (isLoading || !channels || !allChats) return <Pending />

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
        createGroup: <GroupNavbar profile={profile} setIsCreatingGroup={setIsCreatingGroup} />,
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