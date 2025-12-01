import type { Movie } from "@/api/movie";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link to="/movies/$movieId" params={{ movieId: movie.id.toString() }}>
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
