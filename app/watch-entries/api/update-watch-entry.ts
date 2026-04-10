"use server";

import { apiClient } from "@/lib/api-client";
import { UpdateWatchEntry } from "../types/update-watch-entry";

export async function updateWatchEntry(
  watchEntryId: number,
  watchEntry: UpdateWatchEntry,
): Promise<void> {
  return apiClient.put(
    `/watch-entries/${watchEntryId}`,
    watchEntry,
    "Failed to update watch entry",
  );
}
