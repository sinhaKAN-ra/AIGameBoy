import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Game } from "@shared/schema";
import { Gamepad, Rocket } from "lucide-react";

interface ExtendedGame extends Game {
  activePlayerCount?: number;
  growthPercentage?: number;
  aiModelName?: string;
  // Added properties to match schema
  modelVersionId: number | null;
  difficulty: string | null;
  tags: string[] | null;
}

const TrendingGames = () => {
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  // In a real app, we would get trending data from the backend
  // Here we're simulating it with fixed data
  const trendingGames: ExtendedGame[] = [
    {
      ...games?.[0] || { 
        id: 1, 
        title: "Pixel Adventure", 
        description: "A retro-style adventure game", 
        genre: "Adventure", 
        imageUrl: null, 
        embedUrl: null, 
        modelVersionId: 1,
        active: true,
        difficulty: "medium",
        tags: ["adventure", "retro"],
        createdAt: new Date()
      },
      activePlayerCount: 1200,
      growthPercentage: 28,
      aiModelName: "GPT-4"
    },
    {
      ...games?.[1] || { 
        id: 2, 
        title: "AI Chess Master", 
        description: "Play chess against an AI", 
        genre: "Strategy", 
        imageUrl: null, 
        embedUrl: null, 
        modelVersionId: 3,
        active: true,
        difficulty: "hard",
        tags: ["chess", "strategy"],
        createdAt: new Date()
      },
      activePlayerCount: 3500,
      growthPercentage: 42,
      aiModelName: "Claude"
    },
    {
      ...games?.[2] || { 
        id: 3, 
        title: "Space Explorer", 
        description: "Explore procedurally generated galaxies", 
        genre: "Simulation", 
        imageUrl: null, 
        embedUrl: null, 
        modelVersionId: 5,
        active: true,
        difficulty: "medium",
        tags: ["space", "exploration"],
        createdAt: new Date()
      },
      activePlayerCount: 950,
      growthPercentage: 15,
      aiModelName: "Gemini"
    }
  ];

  const getGameIcon = (title: string) => {
    if (title.toLowerCase().includes("chess")) {
      return <Gamepad className="text-white" />;
    } else if (title.toLowerCase().includes("space")) {
      return <Rocket className="text-[#121212]" />;
    } else {
      return <Gamepad className="text-white" />;
    }
  };

  const getIconBgColor = (index: number) => {
    const colors = ["bg-primary", "bg-[#ff5e7d]", "bg-[#ffc857]"];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800">
        <CardHeader>
          <CardTitle className="font-pixel text-lg text-white">Trending Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center p-3 bg-[#121212] rounded-lg">
                <Skeleton className="w-10 h-10 rounded-md" />
                <div className="ml-4 flex-grow">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <CardHeader>
        <CardTitle className="font-pixel text-lg text-white">Trending Games</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingGames.map((game, index) => (
            <Link key={game.id} href={`/games/${game.id}`}>
              <div className="flex items-center p-3 bg-[#121212] rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-colors">
                <div className={`w-10 h-10 ${getIconBgColor(index)} rounded-md flex-shrink-0 flex items-center justify-center`}>
                  {getGameIcon(game.title)}
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="text-white font-medium">{game.title}</h4>
                  <p className="text-xs text-gray-400">{game.aiModelName} • {game.activePlayerCount} active players</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-16 bg-gray-700 rounded-full mr-2">
                    <div className="h-2 bg-[#ffc857] rounded-full" style={{ width: `${Math.min(100, game.growthPercentage || 0)}%` }}></div>
                  </div>
                  <span className="text-[#ffc857] text-sm">+{game.growthPercentage}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingGames;
