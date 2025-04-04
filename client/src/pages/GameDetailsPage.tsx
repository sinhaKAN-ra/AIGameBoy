import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Game, ModelVersion, AiModel } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Github, FileText, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function GameDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");

  // Fetch game details
  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const res = await apiRequest(`/api/games/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch game");
      }
      return await res.json() as Game;
    },
  });

  // Fetch model version details
  const { data: modelVersion, isLoading: versionLoading } = useQuery({
    queryKey: ["model-version", game?.modelVersionId],
    queryFn: async () => {
      if (!game?.modelVersionId) return null;
      const res = await apiRequest("GET", `/api/model-versions/${game.modelVersionId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch model version");
      }
      return await res.json() as ModelVersion;
    },
    enabled: !!game?.modelVersionId,
  });

  // Fetch AI model details
  const { data: aiModel, isLoading: modelLoading } = useQuery({
    queryKey: ["ai-model", modelVersion?.modelId],
    queryFn: async () => {
      if (!modelVersion?.modelId) return null;
      const res = await apiRequest("GET", `/api/models/${modelVersion.modelId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch AI model");
      }
      return await res.json() as AiModel;
    },
    enabled: !!modelVersion?.modelId,
  });

  const isLoading = gameLoading || versionLoading || modelLoading;

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
        <p className="mb-6">The game you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{game.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {game.imageUrl && (
            <img 
              src={game.imageUrl} 
              alt={game.name} 
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ai-integration">AI Integration</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{game.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {game?.categories?.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {aiModel && modelVersion && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">AI Model</h2>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{aiModel.name}</CardTitle>
                      <CardDescription>
                        Version: {modelVersion.version} {modelVersion.isLatest && "(Latest)"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{aiModel.description}</p>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">Capabilities:</h3>
                        <ul className="text-sm text-muted-foreground list-disc pl-5">
                          {modelVersion.capabilities?.map((capability, index) => (
                            <li key={index}>{capability}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ai-integration" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">AI Integration Details</h2>
                <p className="text-muted-foreground whitespace-pre-line">{game.aiIntegrationDetails}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="screenshots" className="space-y-4">
              {game.previewImages && game.previewImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.previewImages.map((image, index) => (
                    <img 
                      key={index} 
                      src={image} 
                      alt={`Screenshot ${index + 1}`} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No screenshots available for this game.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Play Game</CardTitle>
              <CardDescription>Try out this AI-powered game</CardDescription>
            </CardHeader>
            <CardContent>
              {game.gameUrl ? (
                <Button className="w-full" asChild>
                  <a href={game.gameUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Play Now
                  </a>
                </Button>
              ) : (
                <p className="text-muted-foreground">Game URL not available.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Additional information and resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {game.githubUrl && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={game.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              )}
              
              {game.documentationUrl && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={game.documentationUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 