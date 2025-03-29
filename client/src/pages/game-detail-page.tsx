import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Loader2, Trophy, ArrowLeft, Share2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardTable from "@/components/leaderboard-table";
import { Game, AiModel, ScoreSubmission } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

const GameDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const gameId = parseInt(id);

  const { data: game, isLoading: gameLoading } = useQuery<Game>({
    queryKey: [`/api/games/${gameId}`],
    enabled: !isNaN(gameId),
  });

  const { data: model, isLoading: modelLoading } = useQuery<AiModel>({
    queryKey: [`/api/models/${game?.aiModelId}`],
    enabled: !!game?.aiModelId,
  });

  const isLoading = gameLoading || modelLoading;

  const submitScore = async (score: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit your score",
        variant: "destructive",
      });
      return;
    }

    try {
      const scoreData: ScoreSubmission = {
        gameId,
        score,
      };

      await apiRequest("POST", "/api/scores", scoreData);
      
      toast({
        title: "Score Submitted!",
        description: `Your score of ${score} has been recorded.`,
      });
    } catch (error) {
      toast({
        title: "Failed to submit score",
        description: "There was an error submitting your score. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Simulate playing a game and submitting a score
  const playGame = () => {
    // In a real app, this would be the actual game embed
    // For demo purposes, we'll just simulate the game completion after a delay
    toast({
      title: "Game Started",
      description: "You are now playing the game. Your score will be submitted when you finish.",
    });
    
    // Simulate game completion after 3 seconds
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 10000) + 1000;
      submitScore(randomScore);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen py-12 bg-[#121212]">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="font-pixel text-3xl text-white mb-4">Game Not Found</h1>
            <p className="text-gray-400">The game you're looking for doesn't exist or has been removed.</p>
            <Link href="/games">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-[#121212]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/games">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Info */}
          <div className="lg:col-span-2">
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
              <div className="h-64 md:h-80 relative">
                {game.imageUrl ? (
                  <img 
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20">
                    <span className="font-pixel text-2xl text-white">{game.title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#ffc857] text-[#121212]">
                    {model?.name || "AI Game"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <h1 className="font-pixel text-3xl text-white mb-2">{game.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{game.genre}</Badge>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-gray-400 text-sm">Created by {model?.company || "Unknown"}</span>
                </div>
                
                <p className="text-gray-300 mb-6">{game.description}</p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-primary hover:bg-opacity-90 text-white px-6"
                    size="lg"
                    onClick={playGame}
                  >
                    Play Now
                  </Button>
                  <Button variant="outline" className="border-[#ff5e7d] text-[#ff5e7d]">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-gray-400">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Like
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Game Details Tabs */}
            <Tabs defaultValue="about" className="mt-8">
              <TabsList className="bg-[#2a2a2a]">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="ai-details">AI Details</TabsTrigger>
                <TabsTrigger value="how-to-play">How to Play</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="bg-[#2a2a2a] p-6 rounded-b-lg">
                <h3 className="font-pixel text-lg text-white mb-4">About this Game</h3>
                <p className="text-gray-300 mb-4">
                  {game.description}
                </p>
                <p className="text-gray-300">
                  This game was created using {model?.name || "an AI model"} by {model?.company || "an AI developer"}.
                  It showcases capabilities in {game.genre.toLowerCase()} game design.
                </p>
              </TabsContent>
              
              <TabsContent value="ai-details" className="bg-[#2a2a2a] p-6 rounded-b-lg">
                <h3 className="font-pixel text-lg text-white mb-4">AI Model Details</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-medium">
                    {model?.name?.charAt(0) || "AI"}
                  </div>
                  <div>
                    <p className="font-medium text-white">{model?.name || "AI Model"}</p>
                    <p className="text-gray-400">{model?.version || "Unknown version"}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  {model?.description || "No details available about this AI model."}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {model?.capabilities?.split(',').map((capability, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10">
                      {capability.trim()}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="how-to-play" className="bg-[#2a2a2a] p-6 rounded-b-lg">
                <h3 className="font-pixel text-lg text-white mb-4">How to Play</h3>
                <p className="text-gray-300 mb-4">
                  Click the "Play Now" button to start the game. Your score will be automatically recorded once you finish playing.
                </p>
                <div className="bg-[#121212] p-4 rounded-lg">
                  <h4 className="text-[#ffc857] font-medium mb-2">Tips:</h4>
                  <ul className="text-gray-300 list-disc list-inside space-y-2">
                    <li>The higher your score, the higher your ranking on the leaderboard</li>
                    <li>You can play as many times as you want to improve your score</li>
                    <li>Only your highest score will be displayed on the leaderboard</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Leaderboard */}
          <div>
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-pixel text-white flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-[#ffc857]" /> Leaderboard
                  </CardTitle>
                </div>
                <CardDescription>
                  Top scores for {game.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaderboardTable gameId={gameId} limit={10} />
              </CardContent>
            </Card>
            
            {/* Other Games by this AI */}
            <Card className="bg-[#2a2a2a] border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="font-pixel text-white text-lg">More by {model?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href={`/models/${model?.id}`}>
                    <Button variant="link" className="w-full justify-start text-primary">
                      View all games by {model?.name}
                    </Button>
                  </Link>
                  <Link href="/models">
                    <Button variant="link" className="w-full justify-start text-primary">
                      Explore other AI models
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
