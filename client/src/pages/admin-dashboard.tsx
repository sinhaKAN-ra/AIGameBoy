import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Game, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  Gamepad, 
  BarChart, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Shield, 
  Settings 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      if (!user?.isAdmin) return [];
      const res = await apiRequest("GET", "/api/admin/users");
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      return await res.json() as User[];
    },
    enabled: !!user?.isAdmin,
  });

  // Fetch all games
  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ["/api/admin/games"],
    queryFn: async () => {
      if (!user?.isAdmin) return [];
      const res = await apiRequest("GET", "/api/admin/games");
      if (!res.ok) {
        throw new Error("Failed to fetch games");
      }
      return await res.json() as Game[];
    },
    enabled: !!user?.isAdmin,
  });

  // Fetch platform stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      if (!user?.isAdmin) return null;
      const res = await apiRequest("GET", "/api/admin/stats");
      if (!res.ok) {
        throw new Error("Failed to fetch stats");
      }
      return await res.json();
    },
    enabled: !!user?.isAdmin,
  });

  const isLoading = usersLoading || gamesLoading || statsLoading;

  if (!user?.isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to access the admin dashboard.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, games, and platform settings</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <Gamepad className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{games?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Games</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {games?.filter(game => game.active).length || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {games?.filter(game => !game.active).length || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
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
                ) : users && users.length > 0 ? (
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">
                            Joined {formatDistanceToNow(new Date(user.createdAt || ""), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/users/${user.id}`}>
                              <Shield className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No users found</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
                <CardDescription>Latest game submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
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
                ) : games && games.length > 0 ? (
                  <div className="space-y-4">
                    {games.slice(0, 5).map((game) => (
                      <div key={game.id} className="flex items-center gap-4">
                        {game.imageUrl ? (
                          <img 
                            src={game.imageUrl} 
                            alt={game.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Gamepad className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{game.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(game.createdAt || ""), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="ml-auto flex gap-2">
                          {game.active ? (
                            <Badge variant="secondary">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Pending</Badge>
                          )}
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/games/${game.id}`}>
                              <Shield className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No games found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : users && users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.isAdmin ? (
                          <Badge variant="secondary">Admin</Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/users/${user.id}`}>
                            <Shield className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No users found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Games Tab */}
        <TabsContent value="games" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Game Management</CardTitle>
              <CardDescription>Review and manage game submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : games && games.length > 0 ? (
                <div className="space-y-4">
                  {games.map((game) => (
                    <div key={game.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {game.imageUrl ? (
                        <img 
                          src={game.imageUrl} 
                          alt={game.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Gamepad className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{game.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {game.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {game.active ? (
                          <Button variant="ghost" size="sm">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/games/${game.id}`}>
                            <Shield className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No games found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>User and game growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : stats ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Total Users</div>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Total Games</div>
                      <div className="text-2xl font-bold">{stats.totalGames}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Active Games</div>
                      <div className="text-2xl font-bold">{stats.activeGames}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Total Plays</div>
                      <div className="text-2xl font-bold">{stats.totalPlays}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No analytics data available</p>
                )}
              </CardContent>
            </Card>

            {/* Game Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Games</CardTitle>
                <CardDescription>Most played and highest rated games</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
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
                ) : games && games.length > 0 ? (
                  <div className="space-y-4">
                    {games
                      .sort((a, b) => ((b as any).playCount || 0) - ((a as any).playCount || 0))
                      .slice(0, 5)
                      .map((game) => (
                        <div key={game.id} className="flex items-center gap-4">
                          {game.imageUrl ? (
                            <img 
                              src={game.imageUrl} 
                              alt={game.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <Gamepad className="h-5 w-5 text-primary" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{game.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {(game as any).playCount || 0} plays
                            </div>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {(game as any).playCount || 0}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No games found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 