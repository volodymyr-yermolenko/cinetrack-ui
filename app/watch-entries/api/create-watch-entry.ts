"use server";

import { apiClient } from "@/lib/api-client";
import { CreateWatchEntry } from "../types/create-watch-entry";

export async function createWatchEntry(
  watchEntry: CreateWatchEntry,
): Promise<void> {
  return apiClient.post<void>(
    "/watch-entries",
    watchEntry,
    "Failed to create watch entry",
  );
}
