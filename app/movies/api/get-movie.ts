"use server";

import { apiClient } from "@/lib/api-client";
import { Movie } from "../types/movie";

export async function getMovie(movieId: number): Promise<Movie> {
  return apiClient.get<Movie>(`/movies/${movieId}`, "Failed to fetch a movie");
}
