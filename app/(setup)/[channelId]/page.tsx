import React from 'react'
import Chat from '@/components/chat/chat';
import { axiosInstance } from '@/core/axios';
import { currentProfile } from '@/lib/currentProfile';

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
  let channelData = null;

  try {
    const { data } = await axiosInstance.get(`/api/channel/${channelId}`);
    channelData = data;
  } catch (error: any) {
    console.error("Ошибка при загрузке данных о канале:", error);
    return (
      <div>
        <h1>Ошибка при загрузке канала</h1>
        <p>Попробуйте перезагрузить страницу или проверьте ID канала.</p>
      </div>
    );
  }
  const isOwner = channelData?.ownerId === channelData?.members[0]?.profileId;

  return (
    <div>
      <Chat channelData={channelData} profile={currentUser} />
    </div>
  )
}

export default Page
