import CreateGameForm from "@/components/create-game-form";

export default function CreateGamePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Submit a Game</h1>
      <CreateGameForm />
    </div>
  );
} 