import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#121212] border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <img src="/favicon.ico" alt="Logo" className="w-6 h-6" />
              </div>
              <span className="ml-3 text-xl font-pixel text-white">AIGameBoy</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Exploring the evolution of AI-generated games from retro to modern.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-pixel text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-accent text-sm">Home</Link></li>
              <li><Link href="/models" className="text-gray-400 hover:text-accent text-sm">AI Models</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-accent text-sm">Games</Link></li>
              <li><Link href="/leaderboard" className="text-gray-400 hover:text-accent text-sm">Leaderboards</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-accent text-sm">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-pixel text-white text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-accent text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-accent text-sm">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-accent text-sm">FAQ</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-accent text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-accent text-sm">API Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-pixel text-white text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get updates on new AI models and games.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 bg-[#2a2a2a] text-white rounded-l focus:outline-none focus:ring-2 focus:ring-primary flex-grow"
              />
              <button className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-r">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} AI Game Arcade. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-400">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-400">Terms of Service</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-400">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
