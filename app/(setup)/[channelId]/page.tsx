import React from 'react'
import Chat from '@/components/chat/chat';
import { currentProfile } from '@/lib/currentProfile';
import { getCurrentChannel } from '@/lib/utils';

interface ChanelIdParams {
    params: {
        channelId: string
    }
}
const Page = async ({ params }: ChanelIdParams) => {
    const { channelId } = params
    const currentUser = await currentProfile()

    if (!channelId) {
        return null
    }

    const data = await getCurrentChannel(channelId)
    return (
        <div>
            {data?.type === 'channel' ? (
                <Chat
                    chatType="channel"
                    channelData={data}
                    profile={currentUser}
                    apiUrl="/api/get-channel/messages"
                    paramKey="channelId"
                />
            ) : (
                <Chat
                    chatType="conversation"
                    channelData={data}
                    profile={currentUser}
                    apiUrl="/api/get-conversation/messages"
                    paramKey="conversationId"
                />
            )}
        </div>
    )
}

export default Page