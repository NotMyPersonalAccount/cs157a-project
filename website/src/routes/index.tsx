import { getMovies, type Movie } from "@/api/movie";
import MovieGrid from "@/components/Home/MovieGrid";
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

  if (isLoading) return <p>Loading...</p>;
  if (!movies || movies.length === 0) return <p>No movies found</p>;

  return <MovieGrid movies={movies} />
}