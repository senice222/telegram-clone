import { axiosInstance } from "@/core/axios";
import { ChannelType, ChatData, ConversationType } from "@/types/Channel";
import { Group } from "@/types/Group";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getCurrentChannel(channelId: string) {
  let query = null;

  try {
    if (channelId.startsWith('-1')) {
      const { data } = await axiosInstance.get(`/api/group/${channelId}`);
      query = data;
    } else if (channelId.startsWith('-')) {
      const { data } = await axiosInstance.get(`/api/conversation/${channelId}`);
      query = data;
    } else {
      const { data } = await axiosInstance.get(`/api/channel/${channelId}`);
      query = data;
    }
    return query;
  } catch (error: any) {
    console.error("Ошибка при загрузке данных о канале:", error);
  }
}

export const isConversation = (data: ChatData): data is ConversationType => {
  return data.type === 'conversation'
}

export const isChannel = (data: ChatData): data is ChannelType => {
  return data.type === 'channel'
}
export const isGroup = (data: ChatData): data is Group => {
  return data.type === 'group';
}