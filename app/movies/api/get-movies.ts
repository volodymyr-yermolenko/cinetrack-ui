import { apiClient } from "@/app/lib/api-client";
import { Movie } from "../types/movie";

export async function getMovies(genreId?: number): Promise<Movie[]> {
  const path = genreId ? `/movies?genreId=${genreId}` : "/movies";
  return apiClient.get<Movie[]>(path, "Failed to fetch movies");
}
