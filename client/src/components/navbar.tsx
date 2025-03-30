import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, Trophy, LogOut, Code } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="relative z-10 bg-gradient-to-r from-[#121212] to-[#2a2a2a] border-b-2 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <span className="font-pixel text-sm">AI</span>
              </div>
              <span className="ml-3 text-xl font-pixel text-white">AI Game Arcade</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`text-white hover:text-accent ${location === '/' ? 'text-accent' : ''} font-medium`}>
              Home
            </Link>
            <Link href="/models" className={`text-white hover:text-accent ${location === '/models' ? 'text-accent' : ''} font-medium`}>
              AI Models
            </Link>
            <Link href="/games" className={`text-white hover:text-accent ${location === '/games' ? 'text-accent' : ''} font-medium`}>
              Games
            </Link>
            <Link href="/leaderboard" className={`text-white hover:text-accent ${location === '/leaderboard' ? 'text-accent' : ''} font-medium`}>
              Leaderboards
            </Link>
            <Link href="/about" className={`text-white hover:text-accent ${location === '/about' ? 'text-accent' : ''} font-medium`}>
              About
            </Link>
            <Link href="/api-docs" className={`text-white hover:text-accent ${location === '/api-docs' ? 'text-accent' : ''} font-medium`}>
              <Code className="inline-block mr-1 h-4 w-4" /> API
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/leaderboard" className="cursor-pointer w-full">
                      <Trophy className="mr-2 h-4 w-4" /> My Scores
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link href="/auth">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#2a2a2a]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary">
              Home
            </Link>
            <Link href="/models" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary">
              AI Models
            </Link>
            <Link href="/games" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary">
              Games
            </Link>
            <Link href="/leaderboard" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary">
              Leaderboards
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary">
              About
            </Link>
            <Link href="/api-docs" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary">
              <Code className="inline mr-1 h-4 w-4" /> API
            </Link>
            
            {user ? (
              <>
                <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-secondary hover:bg-opacity-80 mb-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-secondary hover:bg-opacity-80 mb-2">
                  Login
                </Link>
                <Link href="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-opacity-80">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
