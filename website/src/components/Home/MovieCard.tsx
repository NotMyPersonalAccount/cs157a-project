import type { Movie } from "@/api/movie";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate({
        to: "/login",
        search: { from: `/movies/${movie.id}` },
      });
    }
  };

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: movie.id.toString() }}
      onClick={handleClick}
      className="block"
    >
      <Card className="max-w-sm pt-0 cursor-pointer hover:shadow-lg transition-shadow border-0">
        <CardContent className="px-0">
          <img
            src={movie.image_url}
            alt={movie.title}
            className="rounded-t-xl w-full"
          />
        </CardContent>
        <CardHeader>
          <CardTitle>{movie.title}</CardTitle>
          <CardDescription>
            <p>{movie.genre} • {movie.release_date.split("-")[0]} • {movie.rating}</p>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}