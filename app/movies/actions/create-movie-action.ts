"use server";

import { revalidatePath } from "next/cache";
import { createMovie } from "../api/create-movie";
import { redirect } from "next/navigation";
import z from "zod";
import { ActionResult } from "@/types/action-result";
import { ApiError } from "@/lib/errors/api-error";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { uploadImage } from "@/lib/cloudinary";
import { validateMovie } from "./validation";

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

  try {
    await createMovie({ ...movieData, imageUrl });
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
