import { useState, useMemo } from "react";
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
import { Loader2, Trophy, Medal, Award, Search, GamepadIcon } from "lucide-react";
import { Game, Score } from "@shared/schema";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ExtendedScore extends Score {
  username: string;
}

// Type guard to check if a game has a name
const hasName = (game: Game): game is Game & { name: string } => {
  return typeof game.name === 'string';
};

// Type guard to check if a game has an id
const hasId = (game: Game): game is Game & { id: number } => {
  return typeof game.id === 'number';
};

// Combined type guard for games with both id and name
const isValidGame = (game: Game): game is Game & { id: number; name: string } => {
  return hasId(game) && hasName(game);
};

const LeaderboardPage = () => {
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showGameSelector, setShowGameSelector] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;

  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
    queryFn: async () => {
      const response = await axios.get('/api/games');
      return response.data;
    }
  });

  const { data: scores, isLoading: scoresLoading } = useQuery<ExtendedScore[]>({
    queryKey: ['/api/scores'],
    queryFn: async () => {
      const response = await axios.get('/api/scores');
      return response.data;
    }
  });

  const isLoading = gamesLoading || scoresLoading;

  // Get scores for selected game or all scores
  const filteredScores = scores?.filter(score => 
    selectedGame === "all" || (score.gameId && score.gameId.toString() === selectedGame)
  );

  // Get game title safely
  const getGameTitle = (gameId: string) => {
    const game = games?.find(g => g.id && g.id.toString() === gameId);
    return game?.name || 'Game';
  };

  // Filter games based on search term
  const filteredGames = games?.filter(game => 
    isValidGame(game) && game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group games by category for better organization
  const groupedGames = useMemo(() => {
    if (!games) return {};
    return games.reduce((acc, game) => {
      if (!isValidGame(game)) return acc;
      const category = game.categories?.[0] || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(game);
      return acc;
    }, {} as Record<string, Game[]>);
  }, [games]);

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-3xl sm:text-4xl text-white mb-4">Global Leaderboards</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See who's topping the charts across all AI-generated games. Can you make it to the top?
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto bg-[#2a2a2a] border-gray-700 text-white hover:bg-[#3a3a3a]"
              onClick={() => setShowGameSelector(!showGameSelector)}
            >
              <GamepadIcon className="mr-2 h-4 w-4" />
              {selectedGame === "all" ? "All Games" : getGameTitle(selectedGame)}
            </Button>
            
            {showGameSelector && (
              <div className="absolute z-10 mt-2 w-full sm:w-96 bg-[#2a2a2a] border border-gray-700 rounded-md shadow-lg">
                <div className="p-2 border-b border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search games..."
                      className="pl-8 bg-[#1a1a1a] border-gray-700 text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="p-2">
                    <div 
                      className={`p-2 rounded-md cursor-pointer hover:bg-[#3a3a3a] ${selectedGame === "all" ? "bg-[#3a3a3a]" : ""}`}
                      onClick={() => {
                        setSelectedGame("all");
                        setShowGameSelector(false);
                      }}
                    >
                      <div className="flex items-center">
                        <GamepadIcon className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-white">All Games</span>
                      </div>
                    </div>
                  </div>
                  
                  {Object.entries(groupedGames).map(([category, categoryGames]) => (
                    <div key={category} className="p-2">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
                        {category}
                      </div>
                      {categoryGames
                        .filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(game => (
                          <div 
                            key={game.id} 
                            className={`p-2 rounded-md cursor-pointer hover:bg-[#3a3a3a] ${selectedGame === game.id?.toString() ? "bg-[#3a3a3a]" : ""}`}
                            onClick={() => {
                              if (game.id) {
                                setSelectedGame(game.id.toString());
                                setShowGameSelector(false);
                              }
                            }}
                          >
                            <div className="flex items-center">
                              {game.imageUrl ? (
                                <img 
                                  src={game.imageUrl} 
                                  alt={game.name} 
                                  className="h-6 w-6 rounded-md object-cover mr-2"
                                />
                              ) : (
                                <GamepadIcon className="mr-2 h-4 w-4 text-primary" />
                              )}
                              <div className="flex flex-col">
                                <span className="text-white">{game.name}</span>
                                <span className="text-xs text-gray-400">
                                  {game.description?.slice(0, 50)}...
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                  
                  {Object.values(groupedGames).flat().filter(game => 
                    game.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                    <div className="p-4 text-center text-gray-400">
                      No games found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-[#2a2a2a] text-gray-300 border-gray-700">
              {filteredScores?.length || 0} Scores
            </Badge>
            <Badge variant="outline" className="bg-[#2a2a2a] text-gray-300 border-gray-700">
              {games?.length || 0} Games
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 gap-2 bg-[#2a2a2a]">
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
                      : `${getGameTitle(selectedGame)} Champions`}
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
                  <LeaderboardTable 
                    gameId={selectedGame !== "all" ? parseInt(selectedGame) : undefined} 
                    page={page}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPage}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="weekly">
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-[#ffc857]" />
                  <CardTitle className="text-white">
                    {selectedGame === "all" 
                      ? "Weekly Champions" 
                      : `${getGameTitle(selectedGame)} Weekly Champions`}
                  </CardTitle>
                </div>
                <CardDescription>
                  {selectedGame === "all" 
                    ? "Top scores from the past 7 days across all AI-generated games" 
                    : "Top players for this game in the past 7 days"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <LeaderboardTable 
                    gameId={selectedGame !== "all" ? parseInt(selectedGame) : undefined} 
                    timeframe="weekly"
                    page={page}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPage}
                  />
                )}
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
                    Your score is based on how well you perform in the game. Higher accuracy and better performance mean higher scores.
                  </p>
                </div>
                <div className="bg-[#121212] p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#ffc857] rounded-full flex items-center justify-center mb-4">
                    <Medal className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-pixel text-white mb-2">Time Bonus</h3>
                  <p className="text-gray-400 text-sm">
                    Complete challenges faster to earn time bonuses. The quicker you finish, the more points you get.
                  </p>
                </div>
                <div className="bg-[#121212] p-6 rounded-lg">
                  <div className="w-12 h-12 bg-[#4ade80] rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-pixel text-white mb-2">Achievement Multipliers</h3>
                  <p className="text-gray-400 text-sm">
                    Unlock achievements to earn score multipliers. Stack multiple achievements for even higher scores.
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
