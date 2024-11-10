import React from 'react';
import ChatWrapper from '@/components/chat/chat-wrapper';
import { currentProfile } from '@/lib/currentProfile';
import { getCurrentChannel } from '@/lib/utils';

interface ChanelIdParams {
    params: {
        channelId: string;
    };
}

type ChatTypes = 'channel' | 'conversation' | 'group';

const Page = async ({ params }: ChanelIdParams) => {
    const { channelId } = params;
    const currentUser = await currentProfile();

    if (!channelId) {
        return null;
    }
    return (
        <div>
            <ChatWrapper id={channelId} profile={currentUser} />
        </div>
    );
};

export default Page;
