"use server";

import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { ActionResult } from "@/types/action-result";
import { redirect } from "next/navigation";
import z from "zod";
import { validateWatchEntry } from "./validation";
import { createWatchEntry } from "../api/create-watch-entry";
import { ApiError } from "next/dist/server/api-utils";
import { revalidatePath } from "next/cache";

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

  try {
    await createWatchEntry({ ...watchEntry.data });
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
