import { Link } from "wouter";
import { Game } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, Trophy, ArrowUpRight } from "lucide-react";

interface GameCardProps {
  game: Game;
  aiModelName?: string;
  playerCount?: number;
}

const GameCard = ({ game, aiModelName, playerCount = 0 }: GameCardProps) => {
  return (
    <Card className="bg-[#2a2a2a] border-gray-800 hover:border-primary transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-pixel text-white flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            {game.title}
          </CardTitle>
          {game.difficulty && (
            <Badge
              variant="outline"
              className={`
                ${game.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400' : ''}
                ${game.difficulty === 'Medium' ? 'bg-yellow-900/20 text-yellow-400' : ''}
                ${game.difficulty === 'Hard' ? 'bg-red-900/20 text-red-400' : ''}
                ${!['Easy', 'Medium', 'Hard'].includes(game.difficulty) ? 'bg-primary/20 text-primary' : ''}
              `}
            >
              {game.difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-300 mb-4 line-clamp-3">{game.description}</p>
        
        {/* AI Model */}
        {aiModelName && (
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
            <span>Created by AI Model:</span>
            <span className="text-primary">{aiModelName}</span>
          </div>
        )}
        
        {/* Player Count */}
        {playerCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
            <Users className="h-4 w-4" />
            <span>{playerCount} active players</span>
          </div>
        )}
        
        {/* Tags */}
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {game.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-primary/10 text-white">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Link href={`/leaderboard?game=${game.id}`}>
          <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary hover:bg-transparent">
            <Trophy className="h-4 w-4 mr-1" />
            Leaderboard
          </Button>
        </Link>
        
        <Link href={`/games/${game.id}`}>
          <Button variant="default" size="sm" className="bg-primary hover:bg-opacity-90">
            Play Game
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GameCard;