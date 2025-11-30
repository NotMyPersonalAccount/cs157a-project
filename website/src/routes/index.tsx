import { getMovies, type Movie } from "@/api/movie";
import MovieCard from "@/components/MovieCard";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: getMovies,
  });

  return isLoading
    ? "Loading..."
    : !movies
    ? "No movies found"
    : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />);
}
