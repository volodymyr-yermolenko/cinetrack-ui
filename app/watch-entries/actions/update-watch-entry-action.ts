"use server";

import { validateWatchEntry } from "./validation";
import z from "zod";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateWatchEntry } from "../api/update-watch-entry";
import { ApiError } from "@/lib/errors/api-error";
import { ActionResult } from "@/types/action-result";

export async function updateWatchEntryAction(
  watchEntryId: number,
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const watchEntry = validateWatchEntry(formData);

  if (!watchEntry.success) {
    const flattened = z.flattenError(watchEntry.error);
    return {
      success: false,
      fieldErrors: formatZodFieldErrors(flattened.fieldErrors),
    };
  }

  try {
    await updateWatchEntry(watchEntryId, { ...watchEntry.data });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        success: false,
        formErrors: [error.message],
      };
    }
    throw error;
  }

  revalidatePath("/watch-entries");
  redirect("/watch-entries");
}
