import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Game } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { 
  Gamepad, 
  BarChart, 
  Activity, 
  Users, 
  Clock, 
  Star, 
  TrendingUp, 
  ArrowLeft, 
  ExternalLink 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GameScore {
  id: number;
  score: number;
  userId: number;
  gameId: number;
  createdAt: string;
  user: {
    username: string;
  };
}

interface GameStats {
  totalPlays: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  recentScores: GameScore[];
  scoreDistribution: {
    range: string;
    count: number;
  }[];
}

export default function GameAnalytics() {
  const { user } = useAuth();
  const [, params] = useParams<{ id: string }>();
  const gameId = parseInt(params?.id || "0", 10);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch game details
  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ["/api/games", gameId],
    queryFn: async () => {
      if (!gameId) return null;
      const res = await apiRequest("GET", `/api/games/${gameId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch game");
      }
      return await res.json() as Game;
    },
    enabled: !!gameId,
  });

  // Fetch game stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/games", gameId, "stats"],
    queryFn: async () => {
      if (!gameId) return null;
      const res = await apiRequest("GET", `/api/games/${gameId}/stats`);
      if (!res.ok) {
        throw new Error("Failed to fetch game stats");
      }
      return await res.json() as GameStats;
    },
    enabled: !!gameId,
  });

  const isLoading = gameLoading || statsLoading;

  if (!gameId) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Game Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested game could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Game Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested game could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {game.imageUrl ? (
          <img 
            src={game.imageUrl} 
            alt={game.name} 
            className="h-16 w-16 rounded-lg object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-primary/20 flex items-center justify-center">
            <Gamepad className="h-8 w-8 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{game.name}</h1>
            {game.active ? (
              <Badge variant="secondary">Active</Badge>
            ) : (
              <Badge variant="outline">Inactive</Badge>
            )}
          </div>
          <p className="text-muted-foreground">{game.description}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/games/${game.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Game
            </Link>
          </Button>
          {game.gameUrl && (
            <Button asChild>
              <a 
                href={game.gameUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                Play Game
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPlays || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageScore ? stats.averageScore.toFixed(0) : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.highestScore || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.recentScores ? new Set(stats.recentScores.map(score => score.userId)).size : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scores">Recent Scores</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Key metrics and trends for {game.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Score Range</div>
                      <div className="text-2xl">
                        {stats.lowestScore} - {stats.highestScore}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Average Score</div>
                      <div className="text-2xl">{stats.averageScore.toFixed(0)}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Score Distribution</div>
                    <div className="space-y-2">
                      {stats.scoreDistribution.map((dist) => (
                        <div key={dist.range} className="flex items-center gap-2">
                          <div className="w-24 text-sm">{dist.range}</div>
                          <div className="flex-1 h-4 bg-primary/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ 
                                width: `${(dist.count / stats.totalPlays) * 100}%` 
                              }}
                            />
                          </div>
                          <div className="w-12 text-sm text-right">{dist.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No analytics data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scores Tab */}
        <TabsContent value="scores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Scores</CardTitle>
              <CardDescription>
                Latest scores from players
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentScores && stats.recentScores.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentScores.map((score) => (
                    <div key={score.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{score.user.username}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDistanceToNow(new Date(score.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {score.score}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No scores recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>
                How scores are distributed across all plays
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.scoreDistribution && stats.scoreDistribution.length > 0 ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {stats.scoreDistribution.map((dist) => (
                      <div key={dist.range} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{dist.range}</div>
                          <div className="text-sm text-muted-foreground">
                            {dist.count} plays
                          </div>
                        </div>
                        <div className="h-4 bg-primary/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ 
                              width: `${(dist.count / stats.totalPlays) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Total plays: {stats.totalPlays}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No distribution data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 