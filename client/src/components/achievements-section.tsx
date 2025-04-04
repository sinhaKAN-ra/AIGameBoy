import { useAchievements } from "../hooks/use-achievements";
import { Trophy, Star, Target, Award } from "lucide-react";

export function AchievementsSection() {
  const { achievements, isLoading, error } = useAchievements();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading achievements. Please try again later.
      </div>
    );
  }

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "trophy":
        return <Trophy className="h-6 w-6" />;
      case "star":
        return <Star className="h-6 w-6" />;
      case "target":
        return <Target className="h-6 w-6" />;
      case "award":
        return <Award className="h-6 w-6" />;
      default:
        return <Trophy className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Achievements</h3>
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center space-x-4 p-4 rounded-lg ${
              achievement.completed
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                achievement.completed
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {renderIcon(achievement.icon)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{achievement.title}</h4>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              {!achievement.completed && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {achievement.progress}% complete
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 