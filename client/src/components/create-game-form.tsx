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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { type Game, type AiModel, type ModelVersion, gameCategories, type GameCategory } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import * as z from "zod";
import { useModels } from "@/hooks/use-models";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  modelVersionId: z.string().min(1, "Please select a model version"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  gameUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  documentationUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  categories: z.array(z.enum(gameCategories)).min(1, "Please select at least one category"),
  aiIntegrationDetails: z.string().min(10, "AI integration details must be at least 10 characters"),
});

const modelFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  logoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

const versionFormSchema = z.object({
  modelId: z.number(),
  version: z.string().min(1, "Version is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  capabilities: z.string().min(10, "Capabilities must be at least 10 characters"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  isLatest: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;
type ModelFormValues = z.infer<typeof modelFormSchema>;
type VersionFormValues = z.infer<typeof versionFormSchema>;

interface CreateGameFormProps {
  onSuccess?: () => void;
}

const CreateGameForm = ({ onSuccess }: CreateGameFormProps) => {
  const { toast } = useToast();
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newPreviewImage, setNewPreviewImage] = useState("");
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);

  // Fetch available AI models
  const { data: models, isLoading: modelsLoading } = useModels();

  // Fetch versions for selected model
  const { data: versions, refetch: refetchVersions } = useQuery({
    queryKey: ['model-versions', selectedModelId],
    queryFn: async () => {
      if (!selectedModelId) return [];
      const res = await apiRequest(`/api/models/${selectedModelId}/versions`);
      if (!res.ok) {
        throw new Error('Failed to fetch versions');
      }
      const data = await res.json();
      return data;
    },
    enabled: !!selectedModelId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      modelVersionId: "",
      imageUrl: "",
      gameUrl: "",
      githubUrl: "",
      documentationUrl: "",
      categories: [],
      aiIntegrationDetails: "",
    },
  });

  const modelForm = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: "",
      company: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
    },
  });

  const versionForm = useForm<VersionFormValues>({
    resolver: zodResolver(versionFormSchema),
    defaultValues: {
      modelId: 0,
      version: "",
      description: "",
      capabilities: "",
      imageUrl: "",
      isLatest: true,
    },
  });

  // Update version form when model is selected
  useEffect(() => {
    if (selectedModelId) {
      versionForm.setValue('modelId', selectedModelId);
    }
  }, [selectedModelId, versionForm]);

  // Create model mutation
  const createModelMutation = useMutation({
    mutationFn: async (data: ModelFormValues) => {
      const res = await apiRequest("POST", "/api/models", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Model created",
        description: "Your new AI model has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/models'] });
      setIsModelDialogOpen(false);
      modelForm.reset();
      // Set the model ID for version creation
      versionForm.setValue('modelId', data.id);
      setIsVersionDialogOpen(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create model",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create version mutation
  const createVersionMutation = useMutation({
    mutationFn: async (data: VersionFormValues) => {
      // Convert capabilities string to array by splitting on newlines
      const processedData = {
        ...data,
        modelId: selectedModelId, // Ensure we use the selected model ID
        capabilities: data.capabilities.split('\n').filter(cap => cap.trim().length > 0),
      };
      
      const res = await apiRequest("POST", "/api/model-versions", processedData);
      if (!res.ok) {
        throw new Error('Failed to create version');
      }
      return await res.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Version created",
        description: "Your new model version has been added successfully",
      });
      // Refetch versions for the current model
      await refetchVersions();
      setIsVersionDialogOpen(false);
      versionForm.reset();
      // Set the selected version ID in the game form
      form.setValue('modelVersionId', data.id.toString());
      setSelectedVersionId(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create version",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create game mutation
  const createGameMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Create a properly formatted game object
      const gameData = {
        name: data.name,
        description: data.description,
        modelVersionId: parseInt(data.modelVersionId, 10),
        imageUrl: data.imageUrl || null,
        gameUrl: data.gameUrl || null,
        githubUrl: data.githubUrl || null,
        documentationUrl: data.documentationUrl || null,
        categories: data.categories,
        aiIntegrationDetails: data.aiIntegrationDetails,
        previewImages: previewImages.length > 0 ? previewImages : null,
        active: true
      };
      
      const res = await apiRequest("POST", "/api/games", gameData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create game');
      }
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
      setPreviewImages([]);
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

  const onSubmit = (data: FormValues) => {
    if (!data.modelVersionId) {
      toast({
        title: "Missing model version",
        description: "Please select a model version",
        variant: "destructive",
      });
      return;
    }
    createGameMutation.mutate(data);
  };

  const onModelSubmit = (data: ModelFormValues) => {
    createModelMutation.mutate(data);
  };

  const onVersionSubmit = (data: VersionFormValues) => {
    createVersionMutation.mutate(data);
  };

  const addPreviewImage = () => {
    if (newPreviewImage && newPreviewImage.startsWith("http")) {
      setPreviewImages([...previewImages, newPreviewImage]);
      setNewPreviewImage("");
    }
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  if (modelsLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="modelVersionId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>AI Model Version</FormLabel>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={(value) => {
                        setSelectedModelId(parseInt(value, 10));
                        field.onChange(""); // Reset version selection
                      }}
                      value={selectedModelId?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AI model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models?.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2 flex-1">
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedVersionId(parseInt(value, 10));
                        }} 
                        value={field.value}
                        disabled={!selectedModelId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a version" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {versions?.map((version: ModelVersion) => (
                            <SelectItem key={version.id} value={version.id.toString()}>
                              {version.version} {version.isLatest ? "(Latest)" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedModelId && (
                        <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              New Version
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Model Version</DialogTitle>
                              <DialogDescription>
                                Add a new version for {models?.find(m => m.id === selectedModelId)?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...versionForm}>
                              <form onSubmit={versionForm.handleSubmit(onVersionSubmit)} className="space-y-4">
                                <FormField
                                  control={versionForm.control}
                                  name="modelId"
                                  render={({ field }) => (
                                    <FormItem className="hidden">
                                      <FormControl>
                                        <Input {...field} type="hidden" value={selectedModelId || ""} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={versionForm.control}
                                  name="version"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Version</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., 1.0.0" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={versionForm.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Describe the version"
                                          className="min-h-[100px]"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={versionForm.control}
                                  name="capabilities"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Capabilities</FormLabel>
                                      <FormDescription>
                                        Enter each capability on a new line
                                      </FormDescription>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Enter capabilities (one per line)"
                                          className="min-h-[100px]"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={versionForm.control}
                                  name="imageUrl"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Image URL</FormLabel>
                                      <FormControl>
                                        <Input placeholder="https://example.com/image.png" {...field} value={field.value || ""} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={versionForm.control}
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
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" className="w-full">
                                  Create Version
                                </Button>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Dialog open={isModelDialogOpen} onOpenChange={setIsModelDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="mt-8">
                  <Plus className="h-4 w-4 mr-2" />
                  New Model
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New AI Model</DialogTitle>
                  <DialogDescription>
                    Add a new AI model to the platform
                  </DialogDescription>
                </DialogHeader>
                <Form {...modelForm}>
                  <form onSubmit={modelForm.handleSubmit(onModelSubmit)} className="space-y-4">
                    <FormField
                      control={modelForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter model name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={modelForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={modelForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the model"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={modelForm.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/logo.png" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={modelForm.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create Model
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Rest of the game form fields */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter game name" {...field} />
                </FormControl>
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
                    placeholder="Describe your game"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4">
            <FormLabel>Preview Images</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewImages.map((url, index) => (
                <Card key={index}>
                  <CardContent className="p-4 relative">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removePreviewImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add preview image URL"
                value={newPreviewImage}
                onChange={(e) => setNewPreviewImage(e.target.value)}
              />
              <Button type="button" onClick={addPreviewImage}>
                Add
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="gameUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/game" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username/repo" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentationUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documentation URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/docs" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <Select
                  onValueChange={(value: GameCategory) => {
                    const currentCategories = field.value || [];
                    if (!currentCategories.includes(value)) {
                      field.onChange([...currentCategories, value]);
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gameCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value?.map((category) => (
                    <div
                      key={category}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                    >
                      {category}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                          field.onChange(field.value?.filter((c) => c !== category));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aiIntegrationDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Integration Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe how the AI is integrated into your game"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Game
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CreateGameForm;