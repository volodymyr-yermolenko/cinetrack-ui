"use server";

import { apiClient } from "@/lib/api-client";
import { Movie } from "../types/movie";

export async function getMovies(
  genreId?: number,
  search?: string,
): Promise<Movie[]> {
  const params = new URLSearchParams();
  if (genreId) {
    params.append("genreId", genreId.toString());
  }
  if (search) {
    params.append("search", search);
  }

  return apiClient.get<Movie[]>(
    `/movies?${params.toString()} `,
    "Failed to fetch movies",
  );
}
