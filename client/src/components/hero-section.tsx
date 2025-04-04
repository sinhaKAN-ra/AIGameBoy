import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FaDiscord, FaReddit, FaGithub } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Welcome to</span>
                <span className="block text-primary">AI Games Hub</span>
              </h1>
              <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                The first dedicated marketplace for games built with AI technology. Discover, play, and create the future of gaming.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/games">
                    <Button size="lg" className="w-full">
                      Discover Games
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/submit-game">
                    <Button variant="outline" size="lg" className="w-full">
                      Submit Your Game
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Community Links */}
              <div className="mt-8 flex justify-center lg:justify-start space-x-6">
                <a href="#" className="text-gray-400 hover:text-primary">
                  <FaDiscord size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <FaReddit size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gradient-to-r from-primary/20 to-primary/5 sm:h-72 md:h-96 lg:h-full lg:w-full">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

