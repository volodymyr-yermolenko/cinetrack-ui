"use server";

import { apiClient } from "@/lib/api-client";
import { UpdateMovie } from "../types/update-movie";

export async function updateMovie(movieId: number, movie: UpdateMovie) {
  return apiClient.put<void>(
    `/movies/${movieId}`,
    movie,
    "Failed to update movie",
  );
}
