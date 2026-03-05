"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { ActionResult } from "@/types/action-result";
import { ApiError } from "@/lib/errors/api-error";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { uploadImage } from "@/lib/cloudinary";
import { updateMovie } from "../api/update-movie";
import { validateMovie } from "./validation";

export async function updateMovieAction(
  movieId: number,
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const movie = validateMovie(formData);

  let imageUrl = formData.get("imageUrl")?.toString() || null;

  if (!movie.success) {
    const flattened = z.flattenError(movie.error);
    return {
      success: false,
      fieldErrors: formatZodFieldErrors(flattened.fieldErrors),
    };
  }

  const { image: imageFile, ...movieData } = movie.data;

  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(imageFile);
    } catch (error) {
      return {
        success: false,
        formErrors: ["Image upload failed. Please try again."],
      };
    }
  }

  try {
    await updateMovie(movieId, { ...movieData, imageUrl });
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
  redirect("/movies");
}
