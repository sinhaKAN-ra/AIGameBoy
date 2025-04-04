import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ModelsPage from "@/pages/models-page";
import ModelDetailPage from "@/pages/model-detail-page";
import GamesPage from "@/pages/games-page";
import GameDetailsPage from "@/pages/GameDetailsPage";
import LeaderboardPage from "@/pages/leaderboard-page";
import ProfilePage from "@/pages/profile-page";
import AboutPage from "@/pages/about-page";
import PrivacyPage from "@/pages/privacy-page";
import TermsPage from "@/pages/terms-page";
import NotFound from "@/pages/not-found";
import ApiDocsPage from "@/pages/api-docs-page";
import CreateModelPage from "@/pages/create-model-page";
import CreateVersionPage from "@/pages/create-version-page";
import CreateGamePage from "@/pages/create-game-page";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/models" component={ModelsPage} />
          <Route path="/models/:id" component={ModelDetailPage} />
          <Route path="/games" component={GamesPage} />
          <Route path="/games/:id" component={GameDetailsPage} />
          <Route path="/leaderboard" component={LeaderboardPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <Route path="/api-docs" component={ApiDocsPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/terms" component={TermsPage} />
          <ProtectedRoute path="/create-model" component={() => <CreateModelPage />} />
          <ProtectedRoute path="/create-version" component={() => <CreateVersionPage />} />
          <ProtectedRoute path="/submit-game" component={() => <CreateGamePage />} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
