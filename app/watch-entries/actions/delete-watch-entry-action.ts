"use server";

import { ActionResult } from "@/types/action-result";
import { ApiError } from "@/lib/errors/api-error";
import { revalidatePath } from "next/cache";
import { deleteWatchEntry } from "../api/delete-watch-entry";

export async function deleteWatchEntryAction(
  watchEntryId: number,
  prevState: ActionResult,
): Promise<ActionResult> {
  try {
    await deleteWatchEntry(watchEntryId);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        success: false,
        formErrors: [error.message],
      };
    }
    throw error;
  }
  console.log("Revalidating path...");
  revalidatePath("/watch-entries");

  return { success: true };
}
