import { getMovieById, type Movie } from "@/api/movie";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailsComponent,
});

function MovieDetailsComponent() {
  const { movieId } = Route.useParams();
  
  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId),
  });

  if (isLoading) return <div className="container mx-auto p-6">Loading...</div>;
  if (!movie) return <div className="container mx-auto p-6">Movie not found</div>;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to movies
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={movie.image_url} 
            alt={movie.title}
            className="w-full rounded-xl shadow-lg"
          />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-semibold">Rating:</span> {movie.rating}</p>
              <p><span className="font-semibold">Genre:</span> {movie.genre}</p>
              <p><span className="font-semibold">Runtime:</span> {movie.runtime} minutes</p>
              <p><span className="font-semibold">Release Date:</span> {movie.release_date}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Plot</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {movie.plot}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}