import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SendMessageRequest } from "@shared/schema";

export function useMessageSender() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: SendMessageRequest) => {
      const res = await apiRequest("POST", "/api/send", data);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate messages list to refresh it
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
  });

  return {
    sendMessage: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
