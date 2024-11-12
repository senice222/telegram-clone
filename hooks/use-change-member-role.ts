import { axiosInstance } from "@/core/axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useChangeMemberRole = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { groupId: string; profileId: string; memberId: string; role: string }) => {
      const { data } = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/group/change-role`,
        payload, 
        {
          headers: { 'Content-Type': 'application/json' }, 
        }
      );

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [data.group.id] });
      queryClient.invalidateQueries({ queryKey: ['allChats'] });
      if (onSuccess) onSuccess();
    },
  });
};