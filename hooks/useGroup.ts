import { axiosInstance } from '@/core/axios';
import { useQuery } from '@tanstack/react-query';

export const useGroups = () =>
    useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/api/groups');
            return data;
        },
    });