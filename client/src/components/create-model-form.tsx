import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { Loader2 } from "lucide-react";
import { insertAiModelSchema, type AiModel } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

const CreateModelForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();

  const form = useForm<AiModel>({
    resolver: zodResolver(insertAiModelSchema),
    defaultValues: {
      name: "",
      company: "",
      description: "",
      logoUrl: "",
      websiteUrl: ""
    },
  });

  const createModelMutation = useMutation({
    mutationFn: async (data: AiModel) => {
      const res = await apiRequest("POST", "/api/models", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "AI Model created",
        description: "Your new AI model has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create AI Model",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: AiModel) => {
    createModelMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="GPT-4, Claude, etc." {...field} />
              </FormControl>
              <FormDescription>
                The name of the AI model
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="OpenAI, Anthropic, etc." {...field} />
              </FormControl>
              <FormDescription>
                The company that created this AI model
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
                  placeholder="A brief description of the model's capabilities and features..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe the model's purpose and capabilities
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                A URL to the model's logo image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                The official website for this AI model
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createModelMutation.isPending}
        >
          {createModelMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create AI Model"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateModelForm;