interface MovieInfoProps {
  rating: string;
  runtime: number;
}

export default function MovieInfo({ rating, runtime }: MovieInfoProps) {
  const runtimeHours = Math.floor(runtime / 60);
  const runtimeMinutes = runtime % 60;

  return (
    <div className="space-y-2 w-[400px]">
      <p className="font-bold text-white text-4xl m-0">{rating}</p>
      <p className="font-bold text-white text-2xl">
        {!runtimeHours ? "" : `${runtimeHours} h `}
        {runtimeMinutes} m
      </p>
    </div>
  );
}
