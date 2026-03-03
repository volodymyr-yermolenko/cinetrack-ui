"use server";

import { apiClient } from "@/lib/api-client";
import { Movie } from "../types/movie";

export async function getMovie(id: number): Promise<Movie> {
  return apiClient.get<Movie>(
    `/movies/${id.toString()}`,
    "Failed to fetch a movie",
  );
}
