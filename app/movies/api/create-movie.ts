"use server";

import { apiClient } from "@/lib/api-client";
import { CreateMovie } from "../types/create-movie";

export async function createMovie(movie: CreateMovie): Promise<void> {
  return apiClient.post<void>("/movies", movie, "Failed to create movie");
}
