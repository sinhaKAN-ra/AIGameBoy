import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Game } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { 
  User, 
  Gamepad, 
  Trophy, 
  CreditCard, 
  Clock, 
  Plus, 
  ExternalLink, 
  BarChart, 
  Activity, 
  Settings,
  Edit,
  Save,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserStats } from "@/components/user-stats";
import { ProfileSettings } from "@/components/profile-settings";
import { GameHistoryTimeline } from "@/components/game-history-timeline";
import { AchievementsSection } from "@/components/achievements-section";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's games
  const { data: userGames, isLoading: gamesLoading } = useQuery({
    queryKey: ["/api/user/games"],
    queryFn: async () => {
      if (!user) return [];
      try {
        const res = await apiRequest("/api/user/games");
        const data = await res.json();
        console.log("User games data:", data);
        return data as Game[];
      } catch (error) {
        console.error("Error fetching user games:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Fetch user's scores
  const { data: userScores, isLoading: scoresLoading } = useQuery({
    queryKey: ["/api/user/scores"],
    queryFn: async () => {
      if (!user) return [];
      try {
        const res = await apiRequest( "/api/user/scores");
        const data = await res.json();
        console.log("User scores data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching user scores:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Fetch user's credits
  const { data: userCredits, isLoading: creditsLoading } = useQuery({
    queryKey: ["/api/user/credits"],
    queryFn: async () => {
      if (!user) return 0;
      try {
        const res = await apiRequest("/api/user/credits");
        const data = await res.json();
        console.log("User credits data:", data);
        return data.credits || 0;
      } catch (error) {
        console.error("Error fetching user credits:", error);
        return 0;
      }
    },
    enabled: !!user,
  });

  // Calculate total score
  const totalScore = userScores?.reduce((sum: number, score: { score: number }) => sum + score.score, 0) || 0;

  // Calculate user level based on total score
  const calculateLevel = (score: number) => {
    // Level 1: 0-100 points
    // Level 2: 101-300 points
    // Level 3: 301-600 points
    // Level 4: 601-1000 points
    // Level 5: 1001+ points
    if (score < 100) return { level: 1, progress: (score / 100) * 100 };
    if (score < 300) return { level: 2, progress: ((score - 100) / 200) * 100 };
    if (score < 600) return { level: 3, progress: ((score - 300) / 300) * 100 };
    if (score < 1000) return { level: 4, progress: ((score - 600) / 400) * 100 };
    return { level: 5, progress: 100 };
  };

  const { level, progress } = calculateLevel(totalScore);

  // Calculate user rank based on level
  const calculateRank = (level: number) => {
    if (level === 1) return "Novice";
    if (level === 2) return "Apprentice";
    if (level === 3) return "Adept";
    if (level === 4) return "Expert";
    return "Master";
  };

  const rank = calculateRank(level);

  // Generate achievements based on user activity
  const generateAchievements = () => {
    const achievements = [];
    
    // First game achievement
    if (userScores && userScores.length > 0) {
      achievements.push({
        id: 1,
        title: "First Game",
        description: "Play your first game",
        icon: "gamepad",
        progress: 100,
        completed: true,
        completedAt: userScores[0].createdAt,
      });
    } else {
      achievements.push({
        id: 1,
        title: "First Game",
        description: "Play your first game",
        icon: "gamepad",
        progress: 0,
        completed: false,
      });
    }
    
    // Score master achievement
    const highestScore = userScores?.reduce((max: number, score: { score: number }) => Math.max(max, score.score), 0) || 0;
    const scoreMasterProgress = Math.min(100, (highestScore / 1000) * 100);
    achievements.push({
      id: 2,
      title: "Score Master",
      description: "Score 1000 points in a single game",
      icon: "trophy",
      progress: scoreMasterProgress,
      completed: scoreMasterProgress >= 100,
      completedAt: scoreMasterProgress >= 100 ? userScores?.find((s: { score: number }) => s.score >= 1000)?.createdAt : undefined,
    });
    
    // Game explorer achievement
    const uniqueGames = userScores ? new Set(userScores.map((score: { gameId: number }) => score.gameId)).size : 0;
    const explorerProgress = Math.min(100, (uniqueGames / 5) * 100);
    achievements.push({
      id: 3,
      title: "Game Explorer",
      description: "Play 5 different games",
      icon: "star",
      progress: explorerProgress,
      completed: explorerProgress >= 100,
      completedAt: explorerProgress >= 100 ? new Date().toISOString() : undefined,
    });
    
    // Achievement hunter achievement
    const completedAchievements = achievements.filter(a => a.completed).length;
    achievements.push({
      id: 4,
      title: "Achievement Hunter",
      description: "Unlock 3 achievements",
      icon: "award",
      progress: Math.min(100, (completedAchievements / 3) * 100),
      completed: completedAchievements >= 3,
      completedAt: completedAchievements >= 3 ? new Date().toISOString() : undefined,
    });
    
    return achievements;
  };

  const achievements = generateAchievements();

  // Handle profile save
  const handleSaveProfile = async (data: { username: string; email: string }) => {
    // In a real app, you would make an API call to update the profile
    console.log("Saving profile:", data);
    // You would typically update the user data in the context here
  };

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to view your profile.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/auth">Log In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Transform scores into game history items
  const gameHistory = userScores?.map((score: any) => ({
    id: score.id,
    gameId: score.gameId,
    gameTitle: userGames?.find((game: Game) => game.id === score.gameId)?.name || "Unknown Game",
    score: score.score,
    createdAt: score.createdAt,
    gameImageUrl: userGames?.find((game: Game) => game.id === score.gameId)?.imageUrl,
  })) || [];

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription>Member since {new Date().toLocaleDateString()}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Total Score</span>
                </div>
                <Badge variant="outline">{totalScore}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Games Played</span>
                </div>
                <Badge variant="outline">{userGames?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Credits</span>
                </div>
                <Badge variant="outline">{userCredits || 0}</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/games">
                <Gamepad className="mr-2 h-4 w-4" />
                Browse Games
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="games">Games</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* User Stats */}
              <UserStats 
                totalScore={totalScore}
                gamesPlayed={userGames?.length || 0}
                credits={userCredits || 0}
                level={level}
                levelProgress={progress}
                achievements={achievements.filter(a => a.completed).length}
                rank={rank}
              />

              {/* Game History Timeline */}
              <GameHistoryTimeline gameHistory={gameHistory} />

              {/* Achievements Section */}
              <AchievementsSection />
            </TabsContent>
            
            {/* Games Tab */}
            <TabsContent value="games" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Games</CardTitle>
                  <CardDescription>Games you've played or created</CardDescription>
                </CardHeader>
                <CardContent>
                  {gamesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  ) : userGames && userGames.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userGames.map((game) => (
                        <Card key={game.id} className="overflow-hidden">
                          <div className="aspect-video bg-muted relative">
                            <img 
                              src={game.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${game.id}`} 
                              alt={game.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{game.name}</CardTitle>
                            <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="p-4 pt-0">
                            <Button asChild variant="outline" className="w-full">
                              <Link href={`/games/${game.id}`}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Game
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You haven't played any games yet.</p>
                      <Button asChild>
                        <Link href="/games">
                          <Gamepad className="mr-2 h-4 w-4" />
                          Browse Games
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <ProfileSettings user={user} onSaveProfile={handleSaveProfile} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
