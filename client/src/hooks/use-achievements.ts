import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Achievement {
  id: number;
  userId: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useAchievements() {
  const queryClient = useQueryClient();

  // Fetch user achievements
  const { data: achievements, isLoading, error } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const response = await axios.get("/api/user/achievements");
      return response.data;
    },
  });

  // Check for new achievements
  const checkAchievements = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/user/check-achievements");
      return response.data.achievements as Achievement[];
    },
    onSuccess: (newAchievements) => {
      // Update the achievements in the cache
      queryClient.setQueryData(["achievements"], (oldData: Achievement[] | undefined) => {
        if (!oldData) return newAchievements;
        
        // Merge old and new achievements, updating existing ones
        const updatedAchievements = [...oldData];
        
        newAchievements.forEach(newAchievement => {
          const existingIndex = updatedAchievements.findIndex(a => a.id === newAchievement.id);
          
          if (existingIndex >= 0) {
            // Update existing achievement
            updatedAchievements[existingIndex] = newAchievement;
          } else {
            // Add new achievement
            updatedAchievements.push(newAchievement);
          }
        });
        
        return updatedAchievements;
      });
    },
  });

  return {
    achievements: achievements || [],
    isLoading,
    error,
    checkAchievements: checkAchievements.mutate,
    isChecking: checkAchievements.isPending,
  };
} 