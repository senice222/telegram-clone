import { axiosInstance } from '@/core/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Group {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: any[];
}

export const useCreateGroup = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/group`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data: Group) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      if (onSuccess) onSuccess();
    },
  });
};
