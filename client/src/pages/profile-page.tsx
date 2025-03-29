import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Calendar, Clock, Gamepad, Eye, Edit, Settings, Medal } from "lucide-react";
import { Game } from "@shared/schema";

interface ScoreWithGame {
  id: number;
  score: number;
  gameId: number;
  userId: number;
  createdAt: Date;
  game: {
    title: string;
  };
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [gameCount, setGameCount] = useState(0);

  const { data: userScores, isLoading: scoresLoading } = useQuery<ScoreWithGame[]>({
    queryKey: [`/api/users/${user?.id}/scores`],
    enabled: !!user?.id,
  });

  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const isLoading = scoresLoading || gamesLoading;

  // Calculate stats
  const totalScore = userScores?.reduce((sum, score) => sum + score.score, 0) || 0;
  const highestScore = userScores?.length 
    ? Math.max(...userScores.map(score => score.score)) 
    : 0;
  
  // Count unique games played
  useEffect(() => {
    if (userScores) {
      const uniqueGameIds = new Set(userScores.map(score => score.gameId));
      setGameCount(uniqueGameIds.size);
    }
  }, [userScores]);

  // Get recent activity
  const recentActivity = userScores 
    ? [...userScores].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
    : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] py-12 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
            <CardDescription className="text-center">
              Please log in to view your profile
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/auth">Login</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#2a2a2a] border-gray-800 mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
                    <AvatarFallback className="bg-primary text-2xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-pixel text-xl text-white mb-1">{user.username}</h2>
                  <p className="text-gray-400 text-sm mb-4">Player since {new Date(user.createdAt as Date).toLocaleDateString()}</p>
                  
                  <div className="grid grid-cols-3 gap-2 w-full text-center mb-4">
                    <div className="bg-[#121212] p-2 rounded">
                      <p className="font-pixel text-primary">{userScores?.length || 0}</p>
                      <p className="text-gray-400 text-xs">Games</p>
                    </div>
                    <div className="bg-[#121212] p-2 rounded">
                      <p className="font-pixel text-primary">{gameCount}</p>
                      <p className="text-gray-400 text-xs">Unique</p>
                    </div>
                    <div className="bg-[#121212] p-2 rounded">
                      <p className="font-pixel text-primary">{totalScore.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">Points</p>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-gray-700">
                        <Settings className="h-4 w-4 mr-2" /> Profile Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#2a2a2a] border-gray-800">
                      <DialogHeader>
                        <DialogTitle className="font-pixel text-white">Profile Settings</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-gray-400 text-center">
                          Profile settings will be available in a future update.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="font-pixel text-white text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {userScores && userScores.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-[#121212] p-3 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-[#ffc857] flex items-center justify-center">
                        <Gamepad className="h-5 w-5 text-[#121212]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Game Explorer</p>
                        <p className="text-gray-400 text-xs">Played your first AI game</p>
                      </div>
                    </div>
                    
                    {gameCount >= 3 && (
                      <div className="flex items-center gap-3 bg-[#121212] p-3 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">AI Enthusiast</p>
                          <p className="text-gray-400 text-xs">Played 3+ different games</p>
                        </div>
                      </div>
                    )}
                    
                    {highestScore >= 5000 && (
                      <div className="flex items-center gap-3 bg-[#121212] p-3 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-[#ff5e7d] flex items-center justify-center">
                          <Medal className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">High Scorer</p>
                          <p className="text-gray-400 text-xs">Achieved 5,000+ points</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Trophy className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">Play games to earn achievements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-[#2a2a2a] border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="font-pixel text-white">Gaming Statistics</CardTitle>
                <CardDescription>
                  Your performance across all AI-generated games
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#121212] p-6 rounded-lg">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-pixel text-white mb-2">Highest Score</h3>
                      <p className="text-4xl font-pixel text-green-500">{highestScore.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#121212] p-6 rounded-lg">
                      <div className="w-12 h-12 bg-[#ff5e7d] rounded-full flex items-center justify-center mb-4">
                        <Gamepad className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-pixel text-white mb-2">Games Played</h3>
                      <p className="text-4xl font-pixel text-green-500">{userScores?.length || 0}</p>
                    </div>
                    <div className="bg-[#121212] p-6 rounded-lg">
                      <div className="w-12 h-12 bg-[#ffc857] rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-[#121212]" />
                      </div>
                      <h3 className="font-pixel text-white mb-2">Latest Game</h3>
                      <p className="text-lg font-medium text-white">
                        {recentActivity.length > 0 
                          ? recentActivity[0].game.title 
                          : "No games yet"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="bg-[#2a2a2a] mb-2">
                <TabsTrigger value="history">Game History</TabsTrigger>
                <TabsTrigger value="favorites">Favorite Games</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history">
                <Card className="bg-[#2a2a2a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-pixel text-white">Your Game History</CardTitle>
                    <CardDescription>
                      Recent scores and games you've played
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : userScores && userScores.length > 0 ? (
                      <div className="space-y-2">
                        {recentActivity.map(score => (
                          <div key={score.id} className="flex items-center justify-between bg-[#121212] p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                                <Gamepad className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{score.game.title}</p>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                  <Clock className="h-3 w-3" /> 
                                  {new Date(score.createdAt).toLocaleDateString()} at {new Date(score.createdAt).toLocaleTimeString()} 
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-pixel text-green-500">{score.score.toLocaleString()}</p>
                              <Button variant="ghost" size="sm" className="text-primary text-xs" asChild>
                                <a href={`/games/${score.gameId}`}>
                                  <Eye className="h-3 w-3 mr-1" /> View Game
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {userScores.length > 5 && (
                          <Button variant="outline" className="w-full mt-4">
                            View All History
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Gamepad className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                        <h3 className="font-pixel text-lg text-white mb-2">No Game History Yet</h3>
                        <p className="text-gray-400 mb-4">
                          You haven't played any games yet. Start playing to build your history!
                        </p>
                        <Button asChild>
                          <a href="/games">Browse Games</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites">
                <Card className="bg-[#2a2a2a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-pixel text-white">Favorite Games</CardTitle>
                    <CardDescription>
                      Games you've marked as favorites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                      <h3 className="font-pixel text-lg text-white mb-2">Coming Soon</h3>
                      <p className="text-gray-400 mb-4">
                        The favorites feature will be available in a future update!
                      </p>
                      <Button asChild>
                        <a href="/games">Browse Games</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
