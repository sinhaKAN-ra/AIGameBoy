import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import * as React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ExternalLink, Calendar, Tag, Laptop, GitBranch } from "lucide-react";
import GameCard from "@/components/game-card";
import { AiModel, ModelVersion, Game } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const ModelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const modelId = id ? parseInt(id) : NaN;
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);

  // Fetch model data
  const { data: model, isLoading: modelLoading } = useQuery<AiModel>({
    queryKey: [`/api/models/${modelId}`],
    enabled: !isNaN(modelId),
  });

  // Fetch model versions
  const { data: versions, isLoading: versionsLoading } = useQuery<ModelVersion[]>({
    queryKey: [`/api/models/${modelId}/versions`],
    enabled: !isNaN(modelId)
  });
  
  // Set selected version when versions data is loaded
  useEffect(() => {
    if (versions && versions.length > 0 && selectedVersionId === null) {
      const latestVersion = versions.find(v => v.isLatest === true);
      if (latestVersion) {
        setSelectedVersionId(latestVersion.id);
      } else {
        // If no latest version is marked, use the first one
        setSelectedVersionId(versions[0].id);
      }
    }
  }, [versions, selectedVersionId]);

  // Fetch games for the selected version
  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: [`/api/model-versions/${selectedVersionId}/games`],
    queryFn: async () => {
      if (!selectedVersionId) return [];
      const res = await apiRequest("GET", `/api/model-versions/${selectedVersionId}/games`);
      if (!res.ok) {
        throw new Error("Failed to fetch games");
      }
      return await res.json();
    },
    enabled: selectedVersionId !== null,
  });

  const isLoading = modelLoading || versionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Model Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The AI model you're looking for doesn't exist.</p>
          </CardContent>
          <CardFooter>
            <Link href="/models">
              <Button>Back to Models</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Find the selected version
  const selectedVersion = versions?.find(v => v.id === selectedVersionId) || null;

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <Link href="/models">
            <span className="hover:text-primary cursor-pointer">Models</span>
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{model.name}</span>
          {selectedVersion && (
            <>
              <span className="mx-2">/</span>
              <span className="text-primary">{selectedVersion.version}</span>
            </>
          )}
        </div>

        {/* Model header */}
        <div className="bg-[#2a2a2a] border-gray-800 rounded-lg p-6 mb-8">
          <div className="md:flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-pixel text-3xl text-white">{model.name}</h1>
                <Badge className="bg-[#ffc857] text-[#121212]">{model.company}</Badge>
              </div>
              <p className="text-gray-300 mt-2 mb-4 max-w-3xl">{model.description}</p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                {model.websiteUrl && (
                  <a 
                    href={model.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <ExternalLink size={16} />
                    Official Website
                  </a>
                )}
              </div>
            </div>
            
            {model.logoUrl && (
              <div className="mt-4 md:mt-0 flex-shrink-0">
                <img 
                  src={model.logoUrl} 
                  alt={`${model.name} logo`}
                  className="w-24 h-24 object-contain bg-white bg-opacity-10 p-2 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Version selector */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h2 className="font-pixel text-xl text-white mb-2">Model Versions</h2>
              <p className="text-gray-400">Select a version to see its capabilities and games</p>
            </div>
            
            <div className="w-full md:w-64">
              <Select
                value={selectedVersionId?.toString()}
                onValueChange={(value) => setSelectedVersionId(parseInt(value))}
              >
                <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                  {versions?.map((version) => (
                    <SelectItem key={version.id} value={version.id.toString()}>
                      <div className="flex items-center gap-2">
                        {version.version}
                        {version.isLatest && (
                          <Badge variant="outline" className="bg-primary/20 text-primary ml-2">
                            Latest
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Selected version details */}
        {selectedVersion && (
          <div className="mb-8">
            <Card className="bg-[#2a2a2a] border-gray-800">
              <CardHeader>
                <CardTitle className="font-pixel text-white flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  {selectedVersion.version}
                  {selectedVersion.isLatest && (
                    <Badge variant="outline" className="bg-primary/20 text-primary ml-2">
                      Latest
                    </Badge>
                  )}
                </CardTitle>
                {selectedVersion.releaseDate && (
                  <CardDescription className="text-gray-400 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Released: {new Date(selectedVersion.releaseDate).toLocaleDateString()}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{selectedVersion.description}</p>
                
                {selectedVersion.capabilities && (
                  <div className="mb-4">
                    <h3 className="text-white font-medium mb-2 flex items-center gap-1.5">
                      <Laptop className="h-4 w-4" />
                      Capabilities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedVersion.capabilities) && selectedVersion.capabilities.map((capability: string, index: number) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="bg-primary/10 text-white"
                        >
                          {capability.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Games created by this model version */}
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h2 className="font-pixel text-xl text-white">Games Created by {selectedVersion?.version}</h2>
            {games && games.length > 0 && (
              <Badge className="mt-2 md:mt-0 bg-[#2a2a2a] text-white">{games.length} games</Badge>
            )}
          </div>

          {gamesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : games && games.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {games.map(game => (
                <GameCard key={game.id} game={game} aiModelName={model.name} playerCount={0} />
              ))}
            </div>
          ) : (
            <div className="bg-[#2a2a2a] border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-300 mb-4">No games have been created with this model version yet.</p>
              {selectedVersion && !selectedVersion.isLatest && (
                <p className="text-gray-400">
                  Try selecting the latest version to see more games.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelDetailPage;