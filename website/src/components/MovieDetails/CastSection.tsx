import Person from "./Person";
import type { MoviePerson } from "@/api/movie";

interface CastSectionProps {
  cast: MoviePerson[];
}

export default function CastSection({ cast }: CastSectionProps) {
  const actors = cast.filter(person => person.role === "actor");

  if (actors.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Cast</h2>
      <div className="space-y-4 max-w-2xl">
        {actors.map((actor) => (
          <Person
            key={actor.person_id}
            personId={actor.person_id}
            name={actor.name}
            image_url={actor.image_url}
            character_name={actor.character_name}
          />
        ))}
      </div>
    </div>
  );
}