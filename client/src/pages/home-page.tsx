import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/hero-section";
import ModelCard from "@/components/model-card";
import GameCard from "@/components/game-card";
import TrendingGames from "@/components/trending-games";
import LeaderboardTable from "@/components/leaderboard-table";
import CallToAction from "@/components/call-to-action";
import LaunchPromotionBanner from "@/components/launch-promotion-banner";
import DevelopersSection from "@/components/developers-section";
import PlayersSection from "@/components/players-section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AiModel, Game, ModelVersion } from "@shared/schema";
import { SeoMeta } from "@/components/seo/SeoMeta";

const HomePage = () => {
  const { data: models, isLoading: isLoadingModels } = useQuery<AiModel[]>({
    queryKey: ['/api/models'],
  });

  const { data: games, isLoading: isLoadingGames } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const { data: modelVersions, isLoading: isLoadingModelVersions } = useQuery<ModelVersion[]>({
    queryKey: ['/api/model-versions'],
  });

  return (
    <>
      <SeoMeta 
        title="Home" 
        description="Experience the ultimate gaming platform with AiGameBoy. Play games created by leading AI models, compete on leaderboards, and create your own AI-powered games!"
        canonicalUrl="/"
      />
      <LaunchPromotionBanner />
      <HeroSection />
      <DevelopersSection />
      <PlayersSection />

      {/* Featured AI Models */}
      <section id="models" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-4">Featured AI Models</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore games created by the most advanced AI models in the world. Each model brings its unique capabilities to game creation.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4">
            {/* Evolution timeline card */}
            <div className="flex-shrink-0 bg-[#2a2a2a] rounded-lg p-4 relative min-w-[280px] border border-gray-800">
              <h3 className="font-pixel text-sm text-[#ffc857] mb-2">Evolution Timeline</h3>
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f" 
                alt="AI Evolution Timeline" 
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p className="text-xs text-gray-400">See how AI game generation has evolved from simple text games to complex immersive experiences.</p>
              <Link href="/about">
                <Button variant="link" size="sm" className="mt-2 text-xs text-primary hover:underline">
                  View Timeline
                </Button>
              </Link>
            </div>
            
            {/* Model cards */}
            {isLoadingModels ? (
              Array(4).fill(null).map((_, i) => (
                <div key={i} className="flex-shrink-0 bg-[#2a2a2a] rounded-lg p-4 relative min-w-[280px] h-[180px] border border-gray-800 animate-pulse"></div>
              ))
            ) : (
              models?.map(model => (
                <ModelCard key={model.id} model={model} />
              ))
            )}
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/models">
            <Button variant="outline" className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
              View All AI Models
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-12 bg-[#2a2a2a]/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-4">Featured Games</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover the latest AI-generated games from various models. Each game showcases unique capabilities of its creator AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingGames ? (
              Array(3).fill(null).map((_, i) => (
                <div key={i} className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-800 h-[300px] animate-pulse"></div>
              ))
            ) : (
              games?.slice(0, 3).map(game => {
                // Find the model version first
                const modelVersion = modelVersions?.find(v => v.id === game.modelVersionId);
                // Then find the model using the model version's modelId
                const modelForGame = models?.find(m => m.id === modelVersion?.modelId);
                return (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    aiModelName={modelForGame?.name || ''}
                    playerCount={Math.floor(Math.random() * 2000) + 500} // Simulated player count
                  />
                );
              })
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/games">
              <Button variant="outline" className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                View All Games
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Leaderboards */}
      <section id="leaderboards" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-4">Global Leaderboards</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See who's topping the charts across all AI-generated games. Can you make it to the top?
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Games */}
          <TrendingGames />
          
          {/* Top Players */}
          <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-800">
            <h3 className="font-pixel text-lg text-white mb-4">Top Players</h3>
            <LeaderboardTable limit={4} />
            
            <div className="mt-4 text-center">
              <Link href="/leaderboard">
                <Button variant="link" className="text-primary hover:text-[#ffc857] text-sm font-medium">
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
};

export default HomePage;
