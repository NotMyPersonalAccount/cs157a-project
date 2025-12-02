import { getPersonById, type Person } from "@/api/person";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Description from "@/components/MovieDetails/Description";
import { formatBirthDate } from "@/utils/date";

export const Route = createFileRoute("/people/$personId")({
  component: PersonDetailsComponent,
});

function PersonDetailsComponent() {
  const { personId } = Route.useParams();

  const { data: person, isLoading } = useQuery<Person>({
    queryKey: ["person", personId],
    queryFn: () => getPersonById(personId),
  });

  if (isLoading) return <div className="container mx-auto p-6 text-white">Loading...</div>;
  if (!person) return <div className="container mx-auto p-6 text-white">Person not found</div>;

  const { formatted: birthText, age } = formatBirthDate(person.birth_date);

  return (
    <div className="container mx-auto px-6 pt-6 pb-0 max-w-6xl">
      <button
        onClick={() => window.history.back()}
        className="text-blue-500 hover:underline mb-6 inline-block cursor-pointer bg-transparent border-none"
      >
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={person.image_url}
            alt={person.name}
            className="w-full rounded-xl shadow-2xl object-cover max-w-sm mx-auto"
          />
        </div>

        <div>
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-3">{person.name}</h1>

            {birthText && (
              <p className="text-xl text-gray-400">
                Born {birthText}
                {age !== null && <span className="text-gray-500 ml-2">• Age {age}</span>}
              </p>
            )}
          </div>

          {person.biography ? (
            <Description content={person.biography} />
          ) : (
            <p className="text-gray-500 italic">No biography available.</p>
          )}
        </div>
      </div>
    </div>
  );
}