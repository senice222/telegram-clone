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
      const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/group`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data: Group) => {
      queryClient.invalidateQueries({ queryKey: ['allChats'] });
      if (onSuccess) onSuccess();
    },
  });
};
export const useAddMemberGroup = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const groupId = formData.get('groupId')
      const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/group/${groupId}/add-users`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [data.group.id] });
      data.newMembers.forEach((member: any) => {
        console.log("member", member);
        queryClient.invalidateQueries({ queryKey: ['allChats', member.memberId] });
      });
      if (onSuccess) onSuccess();
    },
  });
};
