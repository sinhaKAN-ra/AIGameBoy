import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Game, gameCategories } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function GamesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // Fetch games with the correct query key
  const { data: games, isLoading, error } = useQuery({
    queryKey: ["/api/games"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/games");
        if (!res.ok) {
          throw new Error("Failed to fetch games");
        }
        const data = await res.json();
        console.log("Fetched games:", data); // Debug log
        
        // Ensure we have an array of games with required properties
        if (!Array.isArray(data)) {
          console.error("Expected array of games, got:", typeof data);
          return [];
        }
        
        // Validate each game has required properties
        return data.map(game => ({
          id: game.id || 0,
          name: game.name || "Untitled Game",
          description: game.description || "No description available",
          modelVersionId: game.modelVersionId || 0,
          imageUrl: game.imageUrl || null,
          previewImages: game.previewImages || [],
          gameUrl: game.gameUrl || null,
          githubUrl: game.githubUrl || null,
          documentationUrl: game.documentationUrl || null,
          categories: Array.isArray(game.categories) ? game.categories : [],
          aiIntegrationDetails: game.aiIntegrationDetails || "",
          active: game.active !== undefined ? game.active : true,
          createdAt: game.createdAt || new Date().toISOString(),
          updatedAt: game.updatedAt || new Date().toISOString()
        }));
      } catch (error) {
        console.error("Error fetching games:", error);
        throw error;
      }
    },
  });

  // Filter and sort games
  const filteredGames = games?.filter(game => {
    if (!game) return false;
    
    const gameName = game.name || "";
    const gameDescription = game.description || "";
    
    const matchesSearch = gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gameDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           (game.categories && game.categories.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (!a || !b) return 0;
    
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    
    switch (sortBy) {
      case "newest":
        return dateB - dateA;
      case "oldest":
        return dateA - dateB;
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There was a problem loading the games. Please try again later.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Error: {error instanceof Error ? error.message : String(error)}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Games</h1>
        {user && (
          <Button asChild>
            <Link href="/submit-game">
              <Plus className="mr-2 h-4 w-4" />
              Submit Game
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {gameCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "name") => setSortBy(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!games || games.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No games found</h2>
          <p className="text-muted-foreground">
            There are no games available yet. Be the first to submit a game!
          </p>
          {user && (
            <Button asChild className="mt-4">
              <Link href="/submit-game">
                <Plus className="mr-2 h-4 w-4" />
                Submit Game
              </Link>
            </Button>
          )}
        </div>
      ) : filteredGames?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No games found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames?.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    alt={game.name || "Game"}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{game.name || "Untitled Game"}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {game.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {game.categories && game.categories.length > 0 ? (
                      game.categories.map((category: string) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">Uncategorized</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
