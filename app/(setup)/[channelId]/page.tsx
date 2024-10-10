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

    const channelData = await getCurrentChannel(channelId)
    console.log(channelData)
    return (
        <div>
            {channelData.type === 'channel' ? (
                <Chat
                    key="channel"
                    channelData={channelData}
                    profile={currentUser}
                    apiUrl="/api/get-channel/messages"
                    paramKey="channelId"
                />
            ) : (
                <Chat
                    key="conversation"
                    channelData={channelData}
                    profile={currentUser}
                    apiUrl="/api/get-conversation/messages"
                    paramKey="conversationId"
                />
            )}
        </div>
    )
}

export default Page