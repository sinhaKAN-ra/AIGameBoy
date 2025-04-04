import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Gamepad, CreditCard, Star, Target, Award } from "lucide-react";

interface UserStatsProps {
  totalScore: number;
  gamesPlayed: number;
  credits: number;
  level?: number;
  levelProgress?: number;
  achievements?: number;
  rank?: string;
}

export function UserStats({
  totalScore,
  gamesPlayed,
  credits,
  level = 1,
  levelProgress = 0,
  achievements = 0,
  rank = "Novice"
}: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Score Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Score</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalScore.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Your cumulative score across all games
          </p>
        </CardContent>
      </Card>

      {/* Games Played Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Games Played</CardTitle>
          <Gamepad className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{gamesPlayed}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Number of games you've played
          </p>
        </CardContent>
      </Card>

      {/* Credits Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Credits</CardTitle>
          <CreditCard className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{credits.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Available credits for premium features
          </p>
        </CardContent>
      </Card>

      {/* Level Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Level Progress</CardTitle>
          <Star className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold">Level {level}</div>
            <Badge variant="outline">{levelProgress}%</Badge>
          </div>
          <Progress value={levelProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {100 - levelProgress}% to next level
          </p>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          <Award className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{achievements}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Achievements unlocked
          </p>
        </CardContent>
      </Card>

      {/* Rank Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Rank</CardTitle>
          <Target className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rank}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Your current player rank
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 