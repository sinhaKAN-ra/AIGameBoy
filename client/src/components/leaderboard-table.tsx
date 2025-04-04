import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Award, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Score } from "@shared/schema";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ExtendedScore extends Score {
  username: string;
}

interface LeaderboardTableProps {
  gameId?: number;
  limit?: number;
  timeframe?: 'global' | 'weekly';
  page?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

const LeaderboardTable = ({ 
  gameId, 
  limit = 10, 
  timeframe = 'global',
  page = 1,
  itemsPerPage = 10,
  onPageChange
}: LeaderboardTableProps) => {
  const { data: scores, isLoading, error } = useQuery<ExtendedScore[]>({
    queryKey: gameId 
      ? [`/api/games/${gameId}/scores`] 
      : timeframe === 'weekly' 
        ? ['/api/scores/weekly']
        : ['/api/scores'],
    queryFn: async () => {
      const url = gameId 
        ? `/api/games/${gameId}/scores` 
        : timeframe === 'weekly' 
          ? '/api/scores/weekly'
          : '/api/scores';
      const response = await axios.get(url);
      return response.data;
    }
  });
  
  const paginatedScores = useMemo(() => {
    if (!scores) return [];
    const startIndex = (page - 1) * itemsPerPage;
    return scores.slice(startIndex, startIndex + itemsPerPage);
  }, [scores, page, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (!scores) return 1;
    return Math.ceil(scores.length / itemsPerPage);
  }, [scores, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4 bg-red-900/20 rounded-md border border-red-800">
        <p className="font-medium">Failed to load leaderboard data</p>
        <p className="text-sm text-red-400 mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800 hover:bg-transparent">
              <TableHead className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">Rank</TableHead>
              <TableHead className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</TableHead>
              <TableHead className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</TableHead>
              <TableHead className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-800">
            {paginatedScores.map((score, index) => (
              <TableRow key={score.id} className="hover:bg-[#1a1a1a] transition-colors">
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
                    <span className="text-gray-400">#{((page - 1) * itemsPerPage) + index + 1}</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3 bg-primary/20 border border-primary/30">
                      <AvatarFallback className="text-primary text-sm">
                        {score.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-white text-sm font-medium">{score.username}</span>
                      <div className="flex items-center text-xs text-gray-400 mt-0.5">
                        <User className="h-3 w-3 mr-1" />
                        <span>Player</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-pixel text-[#4ade80]">{score.score.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">points</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm text-gray-400 hidden md:table-cell">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                    {score.createdAt ? new Date(score.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {paginatedScores.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Trophy className="h-12 w-12 mb-3 text-gray-600" />
                    <p className="text-lg font-medium">No scores yet</p>
                    <p className="text-sm mt-1">Be the first to play and top the leaderboard!</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {scores && scores.length > itemsPerPage && (
        <div className="flex items-center justify-between px-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
            className="bg-[#2a2a2a] border-gray-700 text-white hover:bg-[#3a3a3a]"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === totalPages}
            className="bg-[#2a2a2a] border-gray-700 text-white hover:bg-[#3a3a3a]"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
