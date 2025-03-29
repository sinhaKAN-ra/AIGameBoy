import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
  aiModelName?: string;
  playerCount?: number;
}

const GameCard = ({ game, aiModelName, playerCount = 0 }: GameCardProps) => {
  return (
    <Card className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-800 hover:border-[#ffc857] transition-all duration-300 relative group">
      <div className="h-48 relative overflow-hidden">
        {game.imageUrl ? (
          <img 
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/20">
            <span className="font-pixel text-lg text-white">{game.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-[#ffc857] text-[#121212] text-xs px-2 py-1 rounded font-medium">
            {aiModelName || `AI Game`}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-pixel text-white text-lg">{game.title}</h3>
          <div className="flex items-center">
            <i className="fas fa-gamepad text-gray-400 mr-1"></i>
            <span className="text-xs text-gray-400">{game.genre}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-4">{game.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {/* This would be dynamic player avatars in a real app */}
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs">P</div>
            <div className="w-6 h-6 rounded-full bg-[#ff5e7d] flex items-center justify-center text-xs">J</div>
            <div className="w-6 h-6 rounded-full bg-[#ffc857] flex items-center justify-center text-xs text-[#121212]">S</div>
          </div>
          <span className="ml-3 text-xs text-gray-400">{playerCount} players</span>
        </div>
        
        <Link href={`/games/${game.id}`}>
          <Button className="bg-primary hover:bg-opacity-80 text-white px-3 py-1 rounded text-sm font-medium">
            Play Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
