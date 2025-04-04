import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const DevelopersSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-pixel text-3xl sm:text-4xl text-white mb-4">For Developers</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Showcase your AI-powered games to a targeted audience passionate about this emerging space
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-800">
            <h3 className="font-pixel text-xl text-white mb-3">List Your Games</h3>
            <p className="text-gray-400 mb-4">Share your AI-powered web games with our growing community of enthusiasts</p>
            <Link href="/submit-game">
              <Button className="w-full">Submit a Game</Button>
            </Link>
          </div>
          
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-800">
            <h3 className="font-pixel text-xl text-white mb-3">Build Your Profile</h3>
            <p className="text-gray-400 mb-4">Create your developer profile and showcase your AI gaming expertise</p>
            <Link href="/profile">
              <Button variant="outline" className="w-full">View Profile</Button>
            </Link>
          </div>
          
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-800">
            <h3 className="font-pixel text-xl text-white mb-3">Gain Insights</h3>
            <p className="text-gray-400 mb-4">Learn which AI models and approaches are gaining traction in the community</p>
            <Link href="/models">
              <Button variant="outline" className="w-full">Explore Models</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection; 