interface MovieHeaderProps {
  title: string;
  release_date: string;
  director: string | null;
  genre: string;
}

export default function MovieHeader({ title, release_date, director, genre }: MovieHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>{new Date(release_date).getFullYear()}</span>
        <span>•</span>
        <span>{genre}</span>
        {director && (
          <>
            <span>•</span>
            <span>Directed by: <span className="text-white">{director}</span></span>
          </>
        )}
      </div>
    </div>
  );
}