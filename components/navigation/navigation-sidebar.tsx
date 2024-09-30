'use client';
// import { currentProfile } from "@/lib/current-profile";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import ManageChannels from "../manage-channels";
import ChatItem from "../chats/chat-item";

const NavigationSidebar = () => {
    const [hovered, setHovered] = useState<boolean>(false)

    return (
        <div
            className="space-y-8 flex flex-col h-full text-primary w-full bg-[rgb(33,33,33)] py-3 relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                <div className="p-2 h-full">
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
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
        </div>
    )
}

export default NavigationSidebar