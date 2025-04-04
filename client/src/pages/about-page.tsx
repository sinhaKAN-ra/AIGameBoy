import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Sparkles, Calendar, Brain } from "lucide-react";
import { SeoMeta } from "@/components/seo/SeoMeta";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <SeoMeta 
        title="About Us" 
        description="Learn about AiGameBoy's mission, our team, and how we're revolutionizing gaming with AI technology."
        canonicalUrl="/about"
      />
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-3xl sm:text-4xl text-white mb-4">About AI Game Arcade</h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Our platform showcases the evolution of AI in game creation, from simple text adventures to complex immersive experiences.
          </p>
        </div>
        
        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="font-pixel text-xl text-[#ffc857] mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-4">
              AI Game Arcade brings together games created by different AI models, showcasing the unique capabilities and creative approaches of each system.
            </p>
            <p className="text-gray-300 mb-4">
              We believe in the future of AI-human collaboration in creative fields and aim to provide a platform where players can experience the cutting edge of AI game development.
            </p>
            <p className="text-gray-300">
              Our community of players provides valuable feedback that helps improve both the games and the AI models that create them.
            </p>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1518895312237-a9e23508077d" 
              alt="AI technology visualization" 
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-16">
          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-pixel text-white mb-2">20+ AI Models</h3>
            <p className="text-sm text-gray-400">Showcasing games from leading AI systems across multiple generations.</p>
          </div>
          
          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <div className="w-12 h-12 bg-[#ff5e7d] rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-pixel text-white mb-2">100+ Games</h3>
            <p className="text-sm text-gray-400">A growing collection of unique AI-generated games across multiple genres.</p>
          </div>
          
          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <div className="w-12 h-12 bg-[#ffc857] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-[#121212]" />
            </div>
            <h3 className="font-pixel text-white mb-2">10k+ Players</h3>
            <p className="text-sm text-gray-400">Join our community of players exploring the future of AI game development.</p>
          </div>
          
          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-pixel text-white mb-2">Weekly Contests</h3>
            <p className="text-sm text-gray-400">Compete in themed tournaments with prizes and recognition.</p>
          </div>
        </div>
        
        {/* Timeline Section */}
        <div className="mb-16">
          <h2 className="font-pixel text-2xl text-white text-center mb-8">The Evolution of AI in Gaming</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
            
            <div className="space-y-12 relative">
              {/* First Era */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg inline-block">
                    <h3 className="font-pixel text-[#ffc857] mb-2">Early Text Adventures (1980s-1990s)</h3>
                    <p className="text-gray-300">
                      The earliest AI in games focused on simple text processing and rule-based systems, 
                      creating text adventures with basic narrative branching.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#ffc857] rounded-full z-10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-[#121212]" />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12"></div>
              </div>
              
              {/* Second Era */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#ff5e7d] rounded-full z-10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:text-left">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg inline-block">
                    <h3 className="font-pixel text-[#ff5e7d] mb-2">Procedural Generation (2000s-2010s)</h3>
                    <p className="text-gray-300">
                      AI techniques evolved to create procedurally generated worlds and levels,
                      allowing for dynamic game environments and endless gameplay variations.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Third Era */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg inline-block">
                    <h3 className="font-pixel text-primary mb-2">Machine Learning NPCs (2010s)</h3>
                    <p className="text-gray-300">
                      The rise of machine learning led to more sophisticated non-player characters 
                      with adaptive behaviors and learning capabilities.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full z-10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12"></div>
              </div>
              
              {/* Fourth Era */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full z-10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:text-left">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg inline-block">
                    <h3 className="font-pixel text-green-500 mb-2">Large Language Models (2020s)</h3>
                    <p className="text-gray-300">
                      The advent of large language models like GPT and multimodal systems
                      has enabled AI to create entire games with rich narratives, visual elements,
                      and gameplay mechanics.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Present */}
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg inline-block border border-[#ffc857]">
                    <h3 className="font-pixel text-[#ffc857] mb-2">Present Day: AI Game Creation</h3>
                    <p className="text-gray-300">
                      Today, AI models can independently design and generate complete games,
                      from concept and art to rules and implementation, opening new frontiers 
                      in creativity and game design.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#ffc857] rounded-full z-10 flex items-center justify-center animate-pulse">
                    <Sparkles className="h-4 w-4 text-[#121212]" />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <Card className="bg-[#2a2a2a] border-gray-800 mb-12">
          <CardContent className="p-8">
            <h2 className="font-pixel text-2xl text-white text-center mb-8">Our Team</h2>
            <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
              AI Game Arcade was founded by a team of AI researchers, game developers, and enthusiasts
              passionate about exploring the intersection of artificial intelligence and creative game design.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-pixel text-white">AI Researchers</h3>
                <p className="text-sm text-gray-400">Exploring cutting-edge models and their creative potential</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-20 h-20 bg-[#ff5e7d]/20 rounded-full mx-auto flex items-center justify-center">
                  <Gamepad2 className="h-8 w-8 text-[#ff5e7d]" />
                </div>
                <h3 className="font-pixel text-white">Game Developers</h3>
                <p className="text-sm text-gray-400">Building the platform and enhancing gameplay experiences</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-20 h-20 bg-[#ffc857]/20 rounded-full mx-auto flex items-center justify-center">
                  <Users className="h-8 w-8 text-[#ffc857]" />
                </div>
                <h3 className="font-pixel text-white">Community Managers</h3>
                <p className="text-sm text-gray-400">Fostering a vibrant player community and gathering feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Contact Section */}
        <div className="text-center mb-12">
          <h2 className="font-pixel text-2xl text-white mb-4">Get In Touch</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Have questions, feedback, or want to collaborate? We'd love to hear from you!
          </p>
          <Button size="lg" className="bg-primary hover:bg-opacity-90 text-white px-6">
            Contact Us
          </Button>
        </div>
        
        {/* Portfolio Section - Other Projects */}
        <div className="mb-16">
          <h2 className="font-pixel text-2xl text-white text-center mb-8">Our Other Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <Card className="bg-[#2a2a2a] border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-primary to-[#ff5e7d] flex items-center justify-center">
                <Brain className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <h3 className="font-pixel text-white text-lg mb-2">Neural Studio</h3>
                <p className="text-gray-400 text-sm mb-4">
                  An interactive platform for visualizing neural networks and understanding AI model decision-making processes.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Machine Learning</span>
                  <span className="text-xs bg-[#ff5e7d]/20 text-[#ff5e7d] px-2 py-1 rounded-full">Visualization</span>
                  <span className="text-xs bg-[#ffc857]/20 text-[#ffc857] px-2 py-1 rounded-full">Education</span>
                </div>
                <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10">
                  View Project
                </Button>
              </CardContent>
            </Card>
            
            {/* Project 2 */}
            <Card className="bg-[#2a2a2a] border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#ff5e7d]/20 hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-[#ff5e7d] to-[#ffc857] flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <h3 className="font-pixel text-white text-lg mb-2">CreativeGen</h3>
                <p className="text-gray-400 text-sm mb-4">
                  A generative art platform where AI and human creativity collaborate to produce unique digital artwork and experiences.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Generative Art</span>
                  <span className="text-xs bg-[#ff5e7d]/20 text-[#ff5e7d] px-2 py-1 rounded-full">Creative AI</span>
                  <span className="text-xs bg-[#ffc857]/20 text-[#ffc857] px-2 py-1 rounded-full">NFT</span>
                </div>
                <Button variant="outline" size="sm" className="w-full border-[#ff5e7d] text-[#ff5e7d] hover:bg-[#ff5e7d]/10">
                  View Project
                </Button>
              </CardContent>
            </Card>
            
            {/* Project 3 */}
            <Card className="bg-[#2a2a2a] border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#ffc857]/20 hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-[#ffc857] to-green-500 flex items-center justify-center">
                <Gamepad2 className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <h3 className="font-pixel text-white text-lg mb-2">RetroSynth</h3>
                <p className="text-gray-400 text-sm mb-4">
                  A tool for recreating classic games with modern AI enhancements, preserving gaming history while adding new features.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Game Preservation</span>
                  <span className="text-xs bg-[#ff5e7d]/20 text-[#ff5e7d] px-2 py-1 rounded-full">AI Enhancement</span>
                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Retro Gaming</span>
                </div>
                <Button variant="outline" size="sm" className="w-full border-[#ffc857] text-[#ffc857] hover:bg-[#ffc857]/10">
                  View Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Separator className="my-12 bg-gray-800" />
        
        <div className="text-center pb-8">
          <h2 className="font-pixel text-2xl text-white mb-4">Join Our Community</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Be part of the AI gaming revolution! Create an account to track your scores,
            compete on leaderboards, and discover new AI-generated games.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth">
              <Button size="lg" className="bg-primary hover:bg-opacity-90 text-white px-6">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/games">
              <Button size="lg" variant="outline" className="border-[#ff5e7d] text-[#ff5e7d] hover:bg-[#ff5e7d]/10 px-6">
                Browse Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
