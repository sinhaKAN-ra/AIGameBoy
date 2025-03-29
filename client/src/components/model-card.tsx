import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiModel } from "@shared/schema";

interface ModelCardProps {
  model: AiModel;
}

const ModelCard = ({ model }: ModelCardProps) => {
  return (
    <Card className="bg-[#2a2a2a] rounded-lg p-4 relative overflow-hidden min-w-[280px] border border-gray-800 hover:border-primary transition-all duration-300 group">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-pixel text-sm text-white">{model.name}</h3>
          <Badge variant="outline" className="bg-[#ffc857] text-[#121212] text-xs px-2 py-1 rounded">{model.company}</Badge>
        </div>
        
        <p className="text-xs text-gray-300 mb-3">{model.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
          </div>
          <span className="ml-2 text-xs text-gray-400">{model.version}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-0 pt-2">
        <span className="text-xs text-gray-400">Games Available</span>
        <Link href={`/models/${model.id}`}>
          <Button variant="default" size="sm" className="bg-primary hover:bg-opacity-80 text-white text-xs px-3 py-1 rounded">
            View Games
          </Button>
        </Link>
      </CardFooter>
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Card>
  );
};

export default ModelCard;
