import { axiosInstance } from "@/core/axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getCurrentChannel(channelId: string) {
  let channelData = null;

  try {
    if (channelId.startsWith('-1')) {
      const { data } = await axiosInstance.get(`/api/group/${channelId}`);
      channelData = data;
    } else if (channelId.startsWith('-')) {
      const { data } = await axiosInstance.get(`/api/conversation/${channelId}`);
      channelData = data;
    } else {
      const { data } = await axiosInstance.get(`/api/channel/${channelId}`);
      channelData = data;
    }
    return channelData;
  } catch (error: any) {
    console.error("Ошибка при загрузке данных о канале:", error);
  }
}