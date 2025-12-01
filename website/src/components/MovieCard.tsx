import type { Movie } from "@/api/movie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Card className="max-w-sm pt-0">
      <CardContent className="px-0">
        <img
          src={movie.image_url}
          className="rounded-t-xl"
        />
      </CardContent>
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>
          <p>{movie.genre} • {movie.release_date.split("-")[0]} • {movie.rating}</p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
