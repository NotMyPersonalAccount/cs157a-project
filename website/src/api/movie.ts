export interface Movie {
  id: number;
  title: string;
  plot: string;
  release_date: string;
  runtime: number;
  rating: string;
  genre: string;
  image_url: string;
}

export async function getMovies() {
  return await (await fetch(`${import.meta.env.VITE_API_URL}/movies`)).json();
}

export async function getMovieById(id: number | string): Promise<Movie> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${id}`);
  return res.json();
}