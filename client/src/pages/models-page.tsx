import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
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
import { Loader2 } from "lucide-react";
import { AiModel } from "@shared/schema";

const ModelsPage = () => {
  const { data: models, isLoading, error } = useQuery<AiModel[]>({
    queryKey: ['/api/models'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load AI models. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-3xl text-white mb-4">AI Models</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the diverse range of AI models creating innovative gaming experiences. Each model has unique capabilities and approaches to game design.
          </p>
        </div>

        {/* Evolution Timeline Card */}
        <Card className="mb-12 bg-[#2a2a2a] border-gray-800 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 relative">
              <img 
                src="https://images.unsplash.com/photo-1642483200566-0c646e6a3643" 
                alt="AI Evolution Timeline" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>
            <div className="md:w-2/3 p-6">
              <CardTitle className="font-pixel text-white mb-3">The Evolution of AI in Gaming</CardTitle>
              <CardDescription className="text-gray-300 mb-4 text-base">
                From the earliest text adventure games to modern immersive worlds, AI has transformed how games are created and played. Explore how each generation of AI models has pushed the boundaries of what's possible.
              </CardDescription>
              <div className="flex flex-wrap gap-4 mt-4">
                <Badge className="bg-primary/20 text-primary border-primary">Text Generation</Badge>
                <Badge className="bg-[#ff5e7d]/20 text-[#ff5e7d] border-[#ff5e7d]">Image Creation</Badge>
                <Badge className="bg-[#ffc857]/20 text-[#ffc857] border-[#ffc857]">World Building</Badge>
                <Badge className="bg-green-500/20 text-green-500 border-green-500">Character Design</Badge>
                <Badge className="bg-blue-500/20 text-blue-500 border-blue-500">Game Logic</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Models Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {models?.map(model => (
            <Card key={model.id} className="bg-[#2a2a2a] border-gray-800 hover:border-primary transition-all duration-300 overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-start pb-2">
                <div>
                  <CardTitle className="font-pixel text-white">{model.name}</CardTitle>
                  <CardDescription className="text-gray-400">{model.version}</CardDescription>
                </div>
                <Badge className="bg-[#ffc857] text-[#121212]">{model.company}</Badge>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-300 mb-4">{model.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {model.capabilities?.split(',').map((capability, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10 text-white">
                      {capability.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <span className="text-sm text-gray-400">Created by {model.company}</span>
                <Link href={`/models/${model.id}`}>
                  <Button variant="default" size="sm" className="bg-primary hover:bg-opacity-90">
                    View Games
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {models?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No AI models found. Check back soon for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsPage;
