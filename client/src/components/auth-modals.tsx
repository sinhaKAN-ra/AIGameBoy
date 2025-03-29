import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

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

const AuthModals = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [location, setLocation] = useLocation();
  
  const { loginMutation, registerMutation } = useAuth();

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
    loginMutation.mutate(data, {
      onSuccess: () => {
        setIsLoginOpen(false);
        if (location === '/auth') {
          setLocation('/');
        }
      },
    });
  };

  const onSignupSubmit = (data: SignupFormValues) => {
    const { terms, ...userData } = data;
    registerMutation.mutate(userData, {
      onSuccess: () => {
        setIsSignupOpen(false);
        if (location === '/auth') {
          setLocation('/');
        }
      },
    });
  };

  const switchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="block w-full sm:w-auto">Login</Button>
        </DialogTrigger>
        <DialogContent className="bg-[#2a2a2a] max-w-md border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="font-pixel text-2xl text-white text-center">Login</DialogTitle>
          </DialogHeader>
          
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Username</FormLabel>
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
                    <FormLabel className="text-gray-400">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-[#121212] border-gray-700"
                      />
                    </FormControl>
                    <div className="flex justify-end mt-1">
                      <a href="#" className="text-xs text-primary hover:text-[#ffc857]">Forgot password?</a>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-opacity-90"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          
          <DialogFooter className="flex flex-col sm:items-center">
            <p className="text-sm text-gray-400">
              Don't have an account? 
              <button onClick={switchToSignup} className="ml-1 text-[#ffc857] hover:underline">Sign up</button>
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogTrigger asChild>
          <Button className="block w-full sm:w-auto">Sign Up</Button>
        </DialogTrigger>
        <DialogContent className="bg-[#2a2a2a] max-w-md border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="font-pixel text-2xl text-white text-center">Create Account</DialogTitle>
          </DialogHeader>
          
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Username</FormLabel>
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
                    <FormLabel className="text-gray-400">Email</FormLabel>
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
                    <FormLabel className="text-gray-400">Password</FormLabel>
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
                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
          
          <DialogFooter className="flex flex-col sm:items-center">
            <p className="text-sm text-gray-400">
              Already have an account? 
              <button onClick={switchToLogin} className="ml-1 text-[#ffc857] hover:underline">Login</button>
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModals;
