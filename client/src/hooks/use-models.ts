import { useQuery } from "@tanstack/react-query";
import { AiModel } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const response = await apiRequest("/api/models");
      return response.json() as Promise<AiModel[]>;
    },
  });
} 