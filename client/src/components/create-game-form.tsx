import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { 
  insertGameSchema, 
  InsertGame, 
  ModelVersion,
  AiModel
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

// Extend the schema with validation for tags input
const createGameSchema = insertGameSchema.extend({
  tags: z.string().optional(),
});

// Create a type that represents the form values
type CreateGameFormValues = z.infer<typeof createGameSchema>;

const CreateGameForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);

  // Fetch available AI models
  const { data: models, isLoading: modelsLoading } = useQuery<AiModel[]>({
    queryKey: ['/api/models'],
  });

  // Fetch model versions when a model is selected
  const { data: versions, isLoading: versionsLoading } = useQuery<ModelVersion[]>({
    queryKey: [`/api/models/${selectedModelId}/versions`],
    enabled: selectedModelId !== null,
  });

  const form = useForm<CreateGameFormValues>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      imageUrl: "",
      embedUrl: "",
      modelVersionId: null,
      difficulty: "Medium",
      tags: "",
      active: true
    },
  });

  // Update modelVersionId in form when dropdown selection changes
  useEffect(() => {
    if (selectedVersionId) {
      form.setValue('modelVersionId', selectedVersionId);
    }
  }, [selectedVersionId, form]);

  const createGameMutation = useMutation({
    mutationFn: async (data: CreateGameFormValues) => {
      // Process tags from comma-separated string to array
      const processedData: InsertGame = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };
      
      // Remove the string version of tags that we added for the form
      delete (processedData as any).tags;
      
      const res = await apiRequest("POST", "/api/games", processedData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Game created",
        description: "Your new game has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      if (selectedVersionId) {
        queryClient.invalidateQueries({ queryKey: [`/api/model-versions/${selectedVersionId}/games`] });
      }
      form.reset();
      setSelectedModelId(null);
      setSelectedVersionId(null);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create game",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CreateGameFormValues) => {
    createGameMutation.mutate(data);
  };

  if (modelsLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!models || models.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400 mb-4">
          No AI models found. Please create an AI model first before adding a game.
        </p>
        <Button asChild className="mr-2">
          <a href="/profile?tab=create-model">Create AI Model</a>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel>Select AI Model</FormLabel>
            <Select 
              onValueChange={(value) => {
                setSelectedModelId(parseInt(value));
                setSelectedVersionId(null);
              }}
              value={selectedModelId?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {models?.map((model) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    {model.name} ({model.company})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <FormField
            control={form.control}
            name="modelVersionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Version</FormLabel>
                <Select 
                  onValueChange={(value) => setSelectedVersionId(parseInt(value))}
                  value={selectedVersionId?.toString()}
                  disabled={!selectedModelId || versionsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={versionsLoading ? "Loading..." : "Select a version"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {versions?.map((version) => (
                      <SelectItem key={version.id} value={version.id.toString()}>
                        {version.version} {version.isLatest ? "(Latest)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The model version used to create this game
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter game title" {...field} />
              </FormControl>
              <FormDescription>
                The name of your game
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your game..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about how to play and what makes it fun
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="Puzzle, Action, Strategy, etc." {...field} />
                </FormControl>
                <FormDescription>
                  The game's category or genre
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How challenging is your game?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="AI, 2D, Puzzle, Multiplayer (comma-separated)" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated tags to help categorize your game
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormDescription>
                A URL to the game's thumbnail or screenshot
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="embedUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game URL</FormLabel>
              <FormControl>
                <Input placeholder="https://your-game-url.com" {...field} />
              </FormControl>
              <FormDescription>
                The URL where your game can be played
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Whether this game is currently available for play
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createGameMutation.isPending || !selectedVersionId}
        >
          {createGameMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Game"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateGameForm;