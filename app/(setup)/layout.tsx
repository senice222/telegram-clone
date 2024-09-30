import NavigationSidebar from '@/components/navigation/navigation-sidebar';
// import { initialProfile } from '@/lib/initialProfile';
import React from 'react'

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
    // const profile = await initialProfile()

    return (
        <div className="h-full w-full">
            <div className="hidden md:flex h-full w-[25vw] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar />
            </div>
            <main className="md:w-[100vw] w-full h-screen bg-chat-pattern-dark bg-[510px_auto] bg-[#0F0F0F] flex items-center justify-center">
                <div className='w-full h-full text-white'>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default SetupLayout
