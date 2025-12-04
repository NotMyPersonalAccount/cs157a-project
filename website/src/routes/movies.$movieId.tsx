import { getMovieById, type MovieWithCast } from "@/api/movie";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import CastSection from "@/components/MovieDetails/CastSection";
import Description from "@/components/MovieDetails/Description";
import MovieHeader from "@/components/MovieDetails/MovieHeader";
import MovieInfo from "@/components/MovieDetails/MovieInfo";
import FavoriteButton from "@/components/MovieDetails/FavoriteButton";
import CommentsSection from "@/components/MovieDetails/CommentSection";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailsComponent,
});

function MovieDetailsComponent() {
  const { movieId } = Route.useParams();
  
  const { data: movie, isLoading } = useQuery<MovieWithCast>({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  if (isLoading) return <div className="container mx-auto p-6 text-white">Loading...</div>;
  if (!movie) return <div className="container mx-auto p-6 text-white">Movie not found</div>;

  return (
    <div className="container mx-auto px-6 pt-6 pb-20 max-w-6xl">
      <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to movies
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-12">
          <img 
            src={movie.image_url} 
            alt={movie.title}
            className="w-full rounded-xl shadow-lg"
          />
          
          <div className="mt-12">
            <CommentsSection movieId={movie.id} />
          </div>
        </div>

        <div>
          <MovieHeader 
            title={movie.title}
            release_date={movie.release_date}
            director={movie.director}
            genre={movie.genre}
          />
          
          <div className="mb-6">
            <FavoriteButton movieId={movie.id} />
          </div>
          
          <div className="flex gap-8 mb-8">
            <MovieInfo 
              rating={movie.rating}
              runtime={movie.runtime}
            />
            <Description content={movie.plot} />
          </div>

          {movie.cast && <CastSection cast={movie.cast} />}
        </div>
      </div>
    </div>
  );
}