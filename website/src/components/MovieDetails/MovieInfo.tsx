interface MovieInfoProps {
  rating: string;
  runtime: number;
}

export default function MovieInfo({ rating, runtime }: MovieInfoProps) {
  return (
    <div className="space-y-2 w-[400px]">
      <p className="font-bold text-white text-4xl m-0">{rating}</p>
      <p className="font-bold text-white text-2xl">{runtime} min</p>
    </div>
  );
}
