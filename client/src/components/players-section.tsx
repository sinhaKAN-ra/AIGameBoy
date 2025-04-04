import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FaDiscord, FaReddit } from "react-icons/fa";

const PlayersSection = () => {
  return (
    <section className="py-16 bg-[#2a2a2a]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-pixel text-3xl sm:text-4xl text-white mb-4">For Players</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover and play cutting-edge games that leverage AI in creative ways
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-800">
            <h3 className="font-pixel text-xl text-white mb-3">Discover Games</h3>
            <p className="text-gray-400 mb-4">Find innovative AI-powered games filtered by model, style, or popularity</p>
            <Link href="/games">
              <Button className="w-full">Browse Games</Button>
            </Link>
          </div>
          
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-800">
            <h3 className="font-pixel text-xl text-white mb-3">Join Discussions</h3>
            <p className="text-gray-400 mb-4">Connect with other players and discuss the future of AI in gaming</p>
            <div className="flex gap-4 justify-center">
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaDiscord size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaReddit size={24} />
              </a>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-800">
            <h3 className="font-pixel text-xl text-white mb-3">Track Progress</h3>
            <p className="text-gray-400 mb-4">Compete on leaderboards and track your achievements across games</p>
            <Link href="/leaderboard">
              <Button variant="outline" className="w-full">View Leaderboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlayersSection; 