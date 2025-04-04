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
  insertModelVersionSchema, 
  InsertModelVersion, 
  AiModel 
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

const CreateVersionForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  // Fetch available AI models
  const { data: models, isLoading: modelsLoading } = useQuery<AiModel[]>({
    queryKey: ['/api/models'],
  });

  const form = useForm<InsertModelVersion>({
    resolver: zodResolver(insertModelVersionSchema),
    defaultValues: {
      modelId: 0,
      version: "",
      description: "",
      releaseDate: new Date(),
      capabilities: [],
      imageUrl: "",
      isLatest: true
    },
  });

  // Update modelId in form when dropdown selection changes
  useEffect(() => {
    if (selectedModelId) {
      form.setValue('modelId', selectedModelId);
    }
  }, [selectedModelId, form]);

  const createVersionMutation = useMutation({
    mutationFn: async (data: InsertModelVersion) => {
      const res = await apiRequest("POST", "/api/model-versions", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Model version created",
        description: "Your new model version has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/model-versions'] });
      if (selectedModelId) {
        queryClient.invalidateQueries({ queryKey: [`/api/models/${selectedModelId}/versions`] });
      }
      form.reset();
      setSelectedModelId(null);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create model version",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertModelVersion) => {
    createVersionMutation.mutate(data);
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
          No AI models found. Please create an AI model first before adding a version.
        </p>
        <Button asChild>
          <a href="/profile?tab=create-model">Create AI Model</a>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="modelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Model</FormLabel>
              <Select 
                onValueChange={(value) => setSelectedModelId(parseInt(value))}
                value={selectedModelId?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an AI model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models?.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name} ({model.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The AI model this version belongs to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input placeholder="v1.0, 2.1, etc." {...field} />
              </FormControl>
              <FormDescription>
                The version identifier (e.g., v1, 2.0, etc.)
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
                  placeholder="Describe what's new or improved in this version..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A description of this model version's features and improvements
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="capabilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capabilities</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Text generation, image analysis, reasoning, etc. (comma-separated)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                List the model's capabilities as comma-separated values
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  value={field.value instanceof Date 
                    ? field.value.toISOString().slice(0, 10) 
                    : field.value || ""
                  }
                  onChange={e => {
                    field.onChange(new Date(e.target.value));
                  }}
                />
              </FormControl>
              <FormDescription>
                When this version was released
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
                <Input placeholder="https://example.com/image.png" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                A URL to an image representing this version
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isLatest"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Latest Version</FormLabel>
                <FormDescription>
                  Mark this as the latest version of the model
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
          disabled={createVersionMutation.isPending || !selectedModelId}
        >
          {createVersionMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Model Version"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateVersionForm;