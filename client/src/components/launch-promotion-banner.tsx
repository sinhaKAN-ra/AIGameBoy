import { Link } from "wouter";

const LaunchPromotionBanner = () => {
  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 py-3 text-center">
        <p className="text-sm text-primary">
          🎉 Launch Promotion: First 50 developers listing their games receive 3 months of premium visibility at no cost!{" "}
          <Link href="/submit-game">
            <span className="font-medium underline hover:text-primary/80">Submit your game now</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LaunchPromotionBanner; 