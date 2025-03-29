import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// Schema for login form
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Schema for signup form
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthPage = () => {
  const [location, navigate] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onSignupSubmit = (data: SignupFormValues) => {
    const { terms, ...userData } = data;
    registerMutation.mutate(userData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 lg:px-8">
        {/* Hero section on the left */}
        <div className="flex flex-col justify-center px-4 order-2 md:order-1">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420" 
              alt="Retro gaming" 
              className="w-full h-64 md:h-full object-cover rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-[#ff5e7d]/40 mix-blend-multiply rounded-lg"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h1 className="font-pixel text-3xl text-white mb-4">AI Game Arcade</h1>
              <p className="text-white max-w-md">
                Join our community of gamers exploring the future of AI-generated games. Track scores, compete on leaderboards, and discover new experiences!
              </p>
            </div>
          </div>
        </div>

        {/* Auth forms on the right */}
        <div className="order-1 md:order-2 flex flex-col justify-center">
          <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-[#2a2a2a]">
              <TabsTrigger value="login" className="font-pixel">Login</TabsTrigger>
              <TabsTrigger value="signup" className="font-pixel">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Welcome back!</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your username" 
                                {...field} 
                                className="bg-[#121212] border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="bg-[#121212] border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-opacity-90"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        ) : null}
                        Login
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card className="bg-[#2a2a2a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Create an account</CardTitle>
                  <CardDescription>Join our community of AI game enthusiasts</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="GameMaster123" 
                                {...field} 
                                className="bg-[#121212] border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your@email.com" 
                                {...field} 
                                className="bg-[#121212] border-gray-700"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="bg-[#121212] border-gray-700"
                              />
                            </FormControl>
                            <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-gray-400">
                                I agree to the <a href="/terms" className="text-[#ffc857] hover:underline">Terms</a> and 
                                <a href="/privacy" className="text-[#ffc857] hover:underline ml-1">Privacy Policy</a>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-opacity-90"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        ) : null}
                        Create Account
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
