"use server";

import { apiClient } from "@/lib/api-client";

export async function deleteWatchEntry(watchEntryId: number): Promise<void> {
  return apiClient.delete(
    `/watch-entries/${watchEntryId}`,
    "Failed to delete watch entry",
  );
}
