import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
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
import { 
  Loader2, Trophy, Calendar, Clock, Gamepad, Eye, Edit, Settings, 
  Medal, PlusCircle, Cpu, Code, Copy, Check, CreditCard, RefreshCw
} from "lucide-react";
import { Game } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CreateModelForm from "@/components/create-model-form";
import CreateVersionForm from "@/components/create-version-form";
import CreateGameForm from "@/components/create-game-form";

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
  const { toast } = useToast();
  const [gameCount, setGameCount] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [purchasingCredits, setPurchasingCredits] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(5);

  const { data: userScores, isLoading: scoresLoading } = useQuery<ScoreWithGame[]>({
    queryKey: [`/api/users/${user?.id}/scores`],
    enabled: !!user?.id,
  });

  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });
  
  // Fetch user credits
  const { 
    data: creditsData,
    isLoading: creditsLoading,
    refetch: refetchCredits
  } = useQuery<{ credits: number }>({
    queryKey: ['/api/user/credits'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/credits");
      return await res.json();
    },
    enabled: !!user,
  });
  
  // Fetch user's API key
  const { 
    data: apiKeyData, 
    isLoading: apiKeyLoading,
    refetch: refetchApiKey
  } = useQuery<{ apiKey: string }>({
    queryKey: ['/api/user/api-key'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/api-key");
      return await res.json();
    },
    enabled: !!user,
  });
  
  const apiKey = apiKeyData?.apiKey;
  const credits = creditsData?.credits || 0;

  const isLoading = scoresLoading || gamesLoading || creditsLoading || apiKeyLoading;
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleRegenerateKey = async () => {
    try {
      setRegenerating(true);
      await apiRequest("POST", "/api/user/api-key/regenerate");
      await refetchApiKey();
      toast({
        title: "API Key Regenerated",
        description: "Your new API key has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate API key.",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };
  
  const handlePurchaseCredits = async () => {
    try {
      setPurchasingCredits(true);
      await apiRequest("POST", "/api/user/credits/purchase", { amount: purchaseAmount });
      await refetchCredits();
      toast({
        title: "Credits Purchased",
        description: `Successfully purchased ${purchaseAmount} credits.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase credits.",
        variant: "destructive",
      });
    } finally {
      setPurchasingCredits(false);
    }
  };

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
                <TabsTrigger value="api-key">API Key</TabsTrigger>
                <TabsTrigger value="credits">Credits</TabsTrigger>
                <TabsTrigger value="create-model">Create Model</TabsTrigger>
                <TabsTrigger value="create-version">Create Version</TabsTrigger>
                <TabsTrigger value="create-game">Create Game</TabsTrigger>
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
              
              <TabsContent value="api-key">
                <Card className="bg-[#2a2a2a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-pixel text-white">Your API Key</CardTitle>
                    <CardDescription>
                      Use this API key to submit scores from your games
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {apiKeyLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <>
                        <div className="p-4 bg-[#121212] rounded-lg mb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-[#ffc857] flex items-center justify-center">
                              <Code className="h-5 w-5 text-[#121212]" />
                            </div>
                            <div>
                              <p className="text-white font-medium">What is an API Key?</p>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Your API key allows games to submit scores on your behalf. Keep it secure and never share it publicly.
                            Use it in your game code when sending score data to our API.
                          </p>
                        </div>
                        
                        <div className="bg-[#121212] p-4 rounded-lg mb-6 relative overflow-hidden">
                          <p className="text-xs text-gray-400 mb-2">Your API Key:</p>
                          <div className="flex items-center justify-between">
                            <code className="font-mono text-white break-all mr-2">{apiKey || 'Loading...'}</code>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="shrink-0"
                              onClick={() => apiKey && handleCopy(apiKey, 'apiKey')}
                              disabled={!apiKey}
                            >
                              {copied === 'apiKey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                          <Button 
                            onClick={handleRegenerateKey} 
                            disabled={regenerating}
                            className="w-full"
                          >
                            {regenerating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Regenerating...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate API Key
                              </>
                            )}
                          </Button>
                          
                          <p className="text-sm text-amber-500">
                            <b>Warning:</b> Regenerating your API key will invalidate the current key.
                            Any applications using your old key will need to be updated.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <a href="/api-docs">
                        <Code className="mr-2 h-4 w-4" />
                        View API Documentation
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="credits">
                <Card className="bg-[#2a2a2a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-pixel text-white">Game Credits</CardTitle>
                    <CardDescription>
                      Use credits to create games from AI models
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {creditsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <>
                        <div className="p-6 bg-[#121212] rounded-lg mb-6 text-center">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                            <CreditCard className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-pixel text-white mb-2">Current Balance</h3>
                          <p className="text-4xl font-pixel text-green-500 mb-2">{credits}</p>
                          <p className="text-gray-400 text-sm">
                            Credits are used each time you create a new game
                          </p>
                        </div>
                        
                        <div className="p-4 bg-[#121212] rounded-lg mb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-[#ff5e7d] flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">How to Earn Credits</p>
                            </div>
                          </div>
                          <ul className="text-gray-400 text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                              <span>Play games to earn credits randomly (20% chance on each submission)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                              <span>Purchase credits below (simulation only)</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-pixel text-white">Purchase Credits</h3>
                          <div className="flex gap-2">
                            {[5, 10, 20, 50].map(amount => (
                              <Button 
                                key={amount}
                                variant={purchaseAmount === amount ? "default" : "outline"}
                                onClick={() => setPurchaseAmount(amount)}
                                className="flex-1"
                              >
                                {amount}
                              </Button>
                            ))}
                          </div>
                          
                          <Button 
                            className="w-full" 
                            disabled={purchasingCredits}
                            onClick={handlePurchaseCredits}
                          >
                            {purchasingCredits ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Purchase {purchaseAmount} Credits
                              </>
                            )}
                          </Button>
                          
                          <p className="text-xs text-gray-400 text-center">
                            Note: This is a simulation. No actual payment will be processed.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="create-model">
                <Card className="bg-[#2a2a2a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-pixel text-white">Create AI Model</CardTitle>
                    <CardDescription>
                      Add a new AI model to showcase in the directory
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-[#121212] rounded-lg mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <Cpu className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">What is an AI Model?</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        An AI model represents a specific AI system like GPT-4, Claude, or DALL-E. 
                        Add basic information about the model here, then create specific versions with the "Create Version" tab.
                      </p>
                    </div>
                    
                    <CreateModelForm />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="create-version">
                <Card className="bg-[#2a2a2a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-pixel text-white">Create Model Version</CardTitle>
                    <CardDescription>
                      Add a new version for an existing AI model
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-[#121212] rounded-lg mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-[#ffc857] flex items-center justify-center">
                          <Code className="h-5 w-5 text-[#121212]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">What is a Model Version?</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Model versions represent specific iterations or releases of an AI model (e.g., GPT-4 vs GPT-4 Turbo).
                        First create an AI model, then add one or more versions to it. Different versions can create different games.
                      </p>
                    </div>
                    
                    <CreateVersionForm />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="create-game">
                <Card className="bg-[#2a2a2a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-pixel text-white">Create Game</CardTitle>
                    <CardDescription>
                      Add a new game created by an AI model version
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-[#121212] rounded-lg mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-[#ff5e7d] flex items-center justify-center">
                          <Gamepad className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Adding a New Game</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        You can add games that were created by a specific AI model version. Make sure you've created the model
                        and version first. The game URL should point to where the game can be played online.
                      </p>
                    </div>
                    
                    <CreateGameForm />
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
