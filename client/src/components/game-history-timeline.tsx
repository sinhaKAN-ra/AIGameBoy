import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Gamepad, Trophy, Clock, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface GameHistoryTimelineProps {
  gameHistory: Array<{
    id: number;
    gameId: number;
    gameName: string;
    score: number;
    playedAt: string;
  }>;
}

export function GameHistoryTimeline({ gameHistory }: GameHistoryTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Game History</h3>
      <div className="space-y-4">
        {gameHistory.map((game) => (
          <div
            key={game.id}
            className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200"
          >
            <div className="flex-1">
              <h4 className="font-medium">{game.gameName}</h4>
              <p className="text-sm text-gray-600">
                Score: {game.score}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(game.playedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 