import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite, getFavorites } from "@/api/favorites";
import { Heart } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface FavoriteButtonProps {
  movieId: number;
}

export default function FavoriteButton({ movieId }: FavoriteButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get all favorites to check if this movie is favorited
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: !!user,
  });

  const isFavorited = favorites.some((fav: { id: number }) => fav.id === movieId);

  const addMutation = useMutation({
    mutationFn: () => addFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const handleClick = () => {
    if (!user) {
      navigate({ to: "/login", search: { from: `/movies/${movieId}` } });
      return;
    }

    if (isFavorited) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  const isLoading = addMutation.isPending || removeMutation.isPending;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer font-semibold transition-all ${
        isFavorited
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
      />
      <span>
        {isLoading
          ? isFavorited
            ? "Removing..."
            : "Adding..."
          : isFavorited
          ? "Favorited"
          : "Add to Favorites"}
      </span>
    </button>
  );
}

