import { Genre } from "../types/genre";
import { apiClient } from "@/lib/api-client";

export async function getGenres(): Promise<Genre[]> {
  return apiClient.get<Genre[]>("/genres", "Failed to fetch genres");
}
