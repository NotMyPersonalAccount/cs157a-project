import { Link } from "@tanstack/react-router";

interface PersonProps {
  personId: number;
  name: string;
  image_url: string;
  character_name?: string | null;
}

export default function Person({ personId, name, image_url, character_name }: PersonProps) {
  return (
    <Link
      to="/people/$personId"
      params={{ personId: personId.toString() }}
      className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-all duration-300 block no-underline"
    >
      <img
        src={image_url}
        alt={name}
        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
      />
      <div>
        <h3 className="font-bold text-white">{name}</h3>
        {character_name && <p className="text-sm text-gray-400">{character_name}</p>}
      </div>
    </Link>
  );
}