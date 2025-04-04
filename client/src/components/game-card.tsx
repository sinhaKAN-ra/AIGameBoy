import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Game } from "@shared/schema";
import { ExternalLink, Users } from "lucide-react";

interface GameCardProps {
  game: Game;
  aiModelName: string;
  playerCount?: number;
}

const GameCard = ({ game, aiModelName, playerCount = 0 }: GameCardProps) => {
  return (
    <Card className="bg-[#2a2a2a] border-gray-800 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-pixel text-white">{game.name}</CardTitle>
          <Badge className="bg-[#ffc857] text-[#121212]">{aiModelName}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 line-clamp-2 mb-4">{game.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {game.categories?.map((category, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="bg-primary/10 text-white"
            >
              {category}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="h-4 w-4" />
          <span>{playerCount} players</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {game.gameUrl && (
          <Button asChild variant="default" className="flex-1">
            <a 
              href={game.gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4" />
              Play Game
            </a>
          </Button>
        )}
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/games/${game.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;