import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/favorites")({
  component: () => (
    <div className="container mx-auto px-6 py-32 text-center">
      <h1 className="text-5xl font-bold text-white mb-4">Favorites</h1>
    </div>
  ),
});