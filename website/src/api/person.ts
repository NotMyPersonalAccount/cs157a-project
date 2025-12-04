import type { Movie } from "./movie";

export interface MovieWithPersonInfo extends Movie {
  role: string;
  character_name: string | null;
}

export interface Person {
  id: number;
  name: string;
  birth_date: string | null;
  biography: string | null;
  image_url: string;
  movies: MovieWithPersonInfo[];
}

export async function getPersonById(id: number | string): Promise<Person> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/people/${id}`);
  if (!res.ok) throw new Error("Failed to fetch person");
  return res.json();
}
