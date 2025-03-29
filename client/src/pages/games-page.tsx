import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameCard from "@/components/game-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { AiModel, Game } from "@shared/schema";

const GamesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");

  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const { data: models, isLoading: modelsLoading } = useQuery<AiModel[]>({
    queryKey: ['/api/models'],
  });

  // Extract unique genres from games
  const genres = games ? [...new Set(games.map(game => game.genre))].sort() : [];

  // Filter games based on search, genre and model
  const filteredGames = games?.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "all" || game.genre === selectedGenre;
    const matchesModel = selectedModel === "all" || game.aiModelId.toString() === selectedModel;
    
    return matchesSearch && matchesGenre && matchesModel;
  });

  if (gamesLoading || modelsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-3xl text-white mb-4">AI-Generated Games</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse our collection of games created by various AI models. Each game showcases the unique capabilities of its creator.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search games..."
              className="pl-10 bg-[#2a2a2a] border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-gray-700">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-700">
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-gray-700">
                <SelectValue placeholder="Filter by AI model" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-700">
                <SelectItem value="all">All Models</SelectItem>
                {models?.map(model => (
                  <SelectItem key={model.id} value={model.id.toString()}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames?.map(game => {
            const modelForGame = models?.find(m => m.id === game.aiModelId);
            return (
              <GameCard 
                key={game.id} 
                game={game} 
                aiModelName={modelForGame?.name}
                playerCount={Math.floor(Math.random() * 2000) + 500} // Simulated player count
              />
            );
          })}
        </div>

        {filteredGames?.length === 0 && (
          <div className="text-center py-12 bg-[#2a2a2a] rounded-lg mt-8">
            <p className="text-gray-400">No games found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
