import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import MovieGrid from "@/components/Home/MovieGrid";
import { getFavorites } from "@/api/favorites";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl font-bold text-white mb-8">Favorites</h1>
        <p className="text-xl text-gray-400 mb-10">
          Please log in to see your favorite movies
        </p>
        <button
          onClick={() => navigate({ to: "/login", search: { from: "/favorites" } })}
          className="px-8 py-4 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-white hover:shadow-xl transition"
        >
          Log In
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-20 text-center text-white text-2xl">
        Loading your favorites...
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Favorites</h1>
        <p className="text-xl text-gray-400">
          You haven't added any favorites yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-white mb-10">
        Favorites ({movies.length})
      </h1>
      <MovieGrid movies={movies} />
    </div>
  );
}