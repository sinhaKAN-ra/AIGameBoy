import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 mb-12 border-b border-gray-800">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-purple-900/20 to-[#121212] opacity-90"></div>
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f" 
          alt="Retro gaming background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="font-pixel text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            <span className="text-[#ffc857]">AI-Generated</span>
            <br />
            <span className="text-white">Game Arcade</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg">
            Explore games created by leading AI models across generations. Play, compete, and climb the leaderboards!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/games">
              <Button className="px-6 py-3 bg-primary rounded shadow-lg hover:bg-opacity-90 font-medium animate-pulse">
                <span className="flex items-center">
                  <i className="fas fa-gamepad mr-2"></i>
                  Start Playing
                </span>
              </Button>
            </Link>
            <Link href="/models">
              <Button variant="outline" className="px-6 py-3 border-secondary hover:bg-opacity-90 font-medium">
                <span className="flex items-center">
                  <i className="fas fa-robot mr-2"></i>
                  Explore AI Models
                </span>
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center">
          <div className="w-72 h-72 sm:w-80 sm:h-80 relative">
            {/* Retro console image */}
            <img 
              src="https://images.unsplash.com/photo-1599409636295-e3cf3538f212" 
              alt="Retro gaming console" 
              className="absolute z-20 w-64 h-64 object-contain top-0 right-0 rounded-lg transform rotate-6 shadow-xl"
            />
            {/* Modern gaming image */}
            <img 
              src="https://images.unsplash.com/photo-1593305841991-05c297ba4575" 
              alt="Modern gaming" 
              className="absolute z-10 w-64 h-64 object-contain bottom-0 left-0 rounded-lg transform -rotate-6 shadow-xl"
            />
          </div>
        </div>
      </div>
      
      {/* Decorative pixel elements */}
      <div className="absolute bottom-0 left-0 w-full h-4 bg-[#ffc857]"></div>
      <div className="absolute bottom-4 left-0 w-full h-2 bg-[#ff5e7d]"></div>
    </section>
  );
};

export default HeroSection;
