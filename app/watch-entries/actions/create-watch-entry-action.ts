"use server";

import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { ActionResult } from "@/types/action-result";
import { redirect } from "next/navigation";
import z from "zod";
import { validateWatchEntry } from "./validation";
import { createWatchEntry } from "../api/create-watch-entry";
import { revalidatePath } from "next/cache";
import { execute } from "@/lib/utils/api-utils";

export async function createWatchEntryAction(
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

  const result = await execute(() => createWatchEntry({ ...watchEntry.data }));
  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }

  revalidatePath("/watch-entries");
  redirect("/watch-entries");
}
