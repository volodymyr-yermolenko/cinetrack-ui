"use server";

import { revalidatePath } from "next/cache";
import { createMovie } from "../api/create-movie";
import { redirect } from "next/navigation";
import z from "zod";
import { ActionResult } from "@/types/action-result";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { uploadImage } from "@/lib/cloudinary";
import { validateMovie } from "./validation";
import { execute } from "@/lib/utils/api-utils";

export async function createMovieAction(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const movie = validateMovie(formData);

  if (!movie.success) {
    const flattened = z.flattenError(movie.error);
    return {
      success: false,
      fieldErrors: formatZodFieldErrors(flattened.fieldErrors),
    };
  }

  const { image: imageFile, ...movieData } = movie.data;

  let imageUrl: string | null = null;
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

  const result = await execute(() => createMovie({ ...movieData, imageUrl }));

  if (!result.success) {
    return {
      success: false,
      formErrors: result.errors,
    };
  }

  revalidatePath("/movies");
  redirect("/movies");
}
