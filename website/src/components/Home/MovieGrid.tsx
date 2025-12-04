import { useState } from "react";
import MovieCard from "./MovieCard";
import type { Movie } from "@/api/movie";

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  const [filter, setFilter] = useState("");

  return (
    <div className="flex flex-col gap-2 mt-8 items-center">
      <input
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search..."
        className="p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {movies
          .filter((m) => !filter.trim() || m.title.includes(filter))
          .map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
      </div>
    </div>
  );
}
