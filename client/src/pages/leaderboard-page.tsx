import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import LeaderboardTable from "@/components/leaderboard-table";
import { Loader2, Trophy, Medal, Award } from "lucide-react";
import { Game, Score } from "@shared/schema";

interface ExtendedScore extends Score {
  username: string;
}

const LeaderboardPage = () => {
  const [selectedGame, setSelectedGame] = useState<string>("all");

  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const { data: scores, isLoading: scoresLoading } = useQuery<ExtendedScore[]>({
    queryKey: ['/api/scores'],
  });

  const isLoading = gamesLoading || scoresLoading;

  // Get scores for selected game or all scores
  const filteredScores = scores?.filter(score => 
    selectedGame === "all" || score.gameId.toString() === selectedGame
  );

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-3xl sm:text-4xl text-white mb-4">Global Leaderboards</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See who's topping the charts across all AI-generated games. Can you make it to the top?
          </p>
        </div>
        
        <div className="flex justify-end mb-6">
          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-[250px] bg-[#2a2a2a] border-gray-700">
              <SelectValue placeholder="Filter by game" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-gray-700">
              <SelectItem value="all">All Games</SelectItem>
              {games?.map(game => (
                <SelectItem key={game.id} value={game.id.toString()}>{game.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-[#2a2a2a]">
            <TabsTrigger value="global" className="font-pixel">Global Leaderboard</TabsTrigger>
            <TabsTrigger value="weekly" className="font-pixel">Weekly Champions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global">
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-[#ffc857]" />
                  <CardTitle className="text-white">
                    {selectedGame === "all" 
                      ? "All-Time Champions" 
                      : `${games?.find(g => g.id.toString() === selectedGame)?.title || 'Game'} Champions`}
                  </CardTitle>
                </div>
                <CardDescription>
                  {selectedGame === "all" 
                    ? "Top scores across all AI-generated games" 
                    : "Top players for this game"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <LeaderboardTable gameId={selectedGame !== "all" ? parseInt(selectedGame) : undefined} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="weekly">
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Medal className="h-6 w-6 text-[#ffc857]" />
                  <CardTitle className="text-white">
                    Weekly Champions
                  </CardTitle>
                </div>
                <CardDescription>
                  This week's top performers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-[#ffc857] mx-auto mb-4" />
                  <h3 className="font-pixel text-lg text-white mb-2">Weekly Challenges Coming Soon!</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    We're working on weekly tournaments and challenges. 
                    Check back soon to compete for the weekly champion title!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#2a2a2a] border-gray-800 md:col-span-3">
            <CardHeader>
              <CardTitle className="font-pixel text-white">How Scoring Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#121212] p-6 rounded-lg">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-pixel text-white mb-2">Score Accuracy</h3>
                  <p className="text-gray-400 text-sm">
                    All scores are verified and calculated by the game itself. 
                    Scores are submitted automatically upon game completion.
                  </p>
                </div>
                <div className="bg-[#121212] p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#ff5e7d] rounded-full flex items-center justify-center mb-4">
                    <Medal className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-pixel text-white mb-2">Ranking System</h3>
                  <p className="text-gray-400 text-sm">
                    Leaderboards display the highest score achieved by each player.
                    Play multiple times to improve your ranking.
                  </p>
                </div>
                <div className="bg-[#121212] p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#ffc857] rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-[#121212]" />
                  </div>
                  <h3 className="font-pixel text-white mb-2">Achievements</h3>
                  <p className="text-gray-400 text-sm">
                    Top performers may receive special recognition and badges
                    on their profile. Keep playing to unlock achievements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
