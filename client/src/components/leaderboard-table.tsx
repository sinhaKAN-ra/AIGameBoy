import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Score } from "@shared/schema";

interface ExtendedScore extends Score {
  username: string;
}

interface LeaderboardTableProps {
  gameId?: number;
  limit?: number;
}

const LeaderboardTable = ({ gameId, limit = 10 }: LeaderboardTableProps) => {
  const { data: scores, isLoading, error } = useQuery<ExtendedScore[]>({
    queryKey: gameId ? [`/api/games/${gameId}/scores`] : ['/api/scores'],
  });
  
  const limitedScores = useMemo(() => {
    if (!scores) return [];
    return scores.slice(0, limit);
  }, [scores, limit]);

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to load leaderboard data
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</TableHead>
            <TableHead className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</TableHead>
            <TableHead className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</TableHead>
            <TableHead className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-800">
          {limitedScores.map((score, index) => (
            <TableRow key={score.id} className="hover:bg-[#121212]">
              <TableCell className="py-4 text-sm">
                {index === 0 ? (
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 text-[#ffc857] mr-1" />
                    <span className="font-medium text-[#ffc857]">1st</span>
                  </div>
                ) : index === 1 ? (
                  <div className="flex items-center">
                    <Medal className="h-4 w-4 text-gray-300 mr-1" />
                    <span className="font-medium text-gray-300">2nd</span>
                  </div>
                ) : index === 2 ? (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-amber-600 mr-1" />
                    <span className="font-medium text-amber-600">3rd</span>
                  </div>
                ) : (
                  <span className="text-gray-400">#{index + 1}</span>
                )}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm">
                    {score.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2 text-white text-sm">{score.username}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 text-sm font-pixel text-[#4ade80]">{score.score.toLocaleString()}</TableCell>
              <TableCell className="py-4 text-sm text-gray-400">
                {new Date(score.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          
          {limitedScores.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-gray-400">
                No scores have been recorded yet. Be the first to play!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
