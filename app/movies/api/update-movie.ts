"use server";

import { apiClient } from "@/lib/api-client";
import { UpdateMovie } from "../types/update-movie";

export async function updateMovie(id: number, movie: UpdateMovie) {
  return apiClient.put<void>(`/movies/${id}`, movie, "Failed to update movie");
}
