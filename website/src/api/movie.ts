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

export interface Person {
  id: number;
  name: string;
  birth_date: string;
  biography: string;
  image_url: string;
}

export interface MoviePerson {
  person_id: number;
  role: string;
  character_name: string | null;
  name: string;
  image_url: string;
}

export interface MovieWithCast extends Movie {
  cast: MoviePerson[];
  director: string | null;
  director_id: number | null;
}

export async function getMovies() {
  return await (await fetch(`${import.meta.env.VITE_API_URL}/movies`)).json();
}

export async function getMovieById(id: number | string): Promise<MovieWithCast> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${id}`);
  return res.json();
}