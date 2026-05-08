"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { ActionResult } from "@/types/action-result";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { uploadImage } from "@/lib/cloudinary";
import { updateMovie } from "../api/update-movie";
import { validateMovie } from "./validation";
import { execute } from "@/lib/utils/api-utils";

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

  const result = await execute(() =>
    updateMovie(movieId, { ...movieData, imageUrl }),
  );
  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }

  revalidatePath("/movies");
  redirect("/movies");
}
