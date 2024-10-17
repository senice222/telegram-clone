import { axiosInstance } from '@/core/axios';
import { useQuery } from '@tanstack/react-query';

export const useGroups = (profileId: string) =>
    useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/groups/${profileId}`);
            return data;
        },
    });