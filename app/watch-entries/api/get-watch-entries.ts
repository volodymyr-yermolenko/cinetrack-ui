"use server";

import { apiClient } from "@/lib/api-client";
import { WatchEntry } from "../types/watch-entry";

export async function getWatchEntries(
  genreId?: number,
  search?: string,
): Promise<WatchEntry[]> {
  const params = new URLSearchParams();
  if (genreId) {
    params.append("genreId", genreId.toString());
  }
  if (search) {
    params.append("search", search);
  }

  const query = params.toString();
  const url = query ? `/watch-entries?${query}` : "/watch-entries";

  const response = await apiClient.get<WatchEntry[]>(
    url,
    "Failed to fetch watch entries",
  );
  return response.map((entry) => ({
    ...entry,
    watchedDate: new Date(entry.watchedDate),
  }));
}
