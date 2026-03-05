"use server";

import { ActionResult } from "@/types/action-result";
import { deleteMovie } from "../api/delete-movie";
import { ApiError } from "@/lib/errors/api-error";
import { revalidatePath } from "next/cache";

export async function deleteMovieAction(
  movieId: number,
  prevState: ActionResult,
): Promise<ActionResult> {
  try {
    await deleteMovie(movieId);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        success: false,
        formErrors: [error.message],
      };
    }
    throw error;
  }
  revalidatePath("/movies");

  return { success: true };
}
