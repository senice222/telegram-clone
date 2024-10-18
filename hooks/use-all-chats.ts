import { axiosInstance } from '@/core/axios';
import { useQuery } from '@tanstack/react-query';

export const useAllChats = (userId: string) => {
    return useQuery({
        queryKey: ['allChats'],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/user/get-user-chats/${userId}`);
            return data;
        },
        enabled: !!userId,
    });
};
 