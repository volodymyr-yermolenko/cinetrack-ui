"use server";

import { validateWatchEntry } from "./validation";
import z from "zod";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateWatchEntry } from "../api/update-watch-entry";
import { ActionResult } from "@/types/action-result";
import { execute } from "@/lib/utils/api-utils";

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

  const result = await execute(() =>
    updateWatchEntry(watchEntryId, { ...watchEntry.data }),
  );
  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }

  revalidatePath("/watch-entries");
  redirect("/watch-entries");
}
