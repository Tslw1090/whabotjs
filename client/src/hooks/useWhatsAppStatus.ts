import { useQuery } from "@tanstack/react-query";
import { WhatsAppStatus } from "@shared/schema";

export function useWhatsAppStatus() {
  return useQuery<WhatsAppStatus>({
    queryKey: ['/api/status'],
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
