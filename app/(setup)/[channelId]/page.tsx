import React from 'react'
import Chat from '@/components/chat/chat';
import { axiosInstance } from '@/core/axios';
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
  
  return (
    <div>
      <Chat channelData={channelData} profile={currentUser} />
    </div>
  )
}

export default Page
