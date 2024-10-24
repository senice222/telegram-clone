import GroupNavbar from '@/components/group-navbar/group-navbar';
import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import { initialProfile } from '@/lib/initialProfile';
import React from 'react'

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
    const profile = await initialProfile()
    
    return (
        <div className="h-full w-full flex">
            <div className="hidden md:flex h-screen w-[25vw] bg-[rgb(33,33,33)] z-30 flex-col">
                <NavigationSidebar profile={profile} />
            </div>

            <main className="md:w-[75vw] w-full h-screen bg-chat-pattern-dark bg-[510px_auto] bg-[#0F0F0F]">
                <div>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default SetupLayout
