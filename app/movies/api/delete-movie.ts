"use server";

import { apiClient } from "@/lib/api-client";

export async function deleteMovie(movieId: number): Promise<void> {
  return apiClient.delete(`/movies/${movieId}`, "Failed to delete movie");
}
