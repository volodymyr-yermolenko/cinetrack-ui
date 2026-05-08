"use server";

import { ActionResult } from "@/types/action-result";
import { deleteMovie } from "../api/delete-movie";
import { revalidatePath } from "next/cache";
import { execute } from "@/lib/utils/api-utils";

export async function deleteMovieAction(
  movieId: number,
  prevState: ActionResult,
): Promise<ActionResult> {
  const result = await execute(() => deleteMovie(movieId));
  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }

  revalidatePath("/movies");

  return { success: true };
}
