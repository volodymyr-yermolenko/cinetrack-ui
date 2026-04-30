"use server";

import { ActionResult } from "@/types/action-result";
import { revalidatePath } from "next/cache";
import { deleteWatchEntry } from "../api/delete-watch-entry";
import { execute } from "@/lib/utils/api-utils";

export async function deleteWatchEntryAction(
  watchEntryId: number,
  prevState: ActionResult,
): Promise<ActionResult> {
  const result = await execute(() => deleteWatchEntry(watchEntryId));
  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }

  revalidatePath("/watch-entries");

  return { success: true };
}
