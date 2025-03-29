import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const CallToAction = () => {
  const { user } = useAuth();

  return (
    <section className="py-16 bg-gradient-to-r from-primary/20 to-[#ff5e7d]/20 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-pixel text-3xl text-white mb-6">Ready to Play?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          {user 
            ? "Continue your journey and discover new AI-generated games as they're released."
            : "Create an account to track your scores, compete on leaderboards, and discover new AI-generated games as they're released."}
        </p>
        
        <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link href="/games">
              <Button size="lg" className="px-8 py-4 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 font-medium text-white">
                <span className="flex items-center justify-center">
                  <i className="fas fa-gamepad mr-2"></i>
                  Browse Games
                </span>
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <Button size="lg" className="px-8 py-4 bg-primary rounded-lg shadow-lg hover:bg-opacity-90 font-medium text-white">
                  <span className="flex items-center justify-center">
                    <i className="fas fa-user-plus mr-2"></i>
                    Sign Up Now
                  </span>
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" size="lg" className="px-8 py-4 border-2 border-[#ff5e7d] rounded-lg hover:bg-[#ff5e7d]/10 font-medium text-white">
                  <span className="flex items-center justify-center">
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Login
                  </span>
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {!user && (
          <p className="mt-6 text-sm text-gray-400">
            Already playing? <Link href="/auth" className="text-[#ffc857] hover:underline">Login</Link> to continue your journey.
          </p>
        )}
      </div>
    </section>
  );
};

export default CallToAction;
