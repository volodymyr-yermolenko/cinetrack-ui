"use server";

import { apiClient } from "@/lib/api-client";
import { WatchEntry } from "../types/watch-entry";

export async function getWatchEntry(watchEntryId: number): Promise<WatchEntry> {
  return apiClient.get(
    `/watch-entries/${watchEntryId}`,
    "Failed to fetch watch entry",
  );
}
