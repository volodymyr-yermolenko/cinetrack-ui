"use server";

import { revalidatePath } from "next/cache";
import { createMovie } from "../api/create-movie";
import { MovieType } from "../types/movie-type";
import { redirect } from "next/navigation";
import z from "zod";
import { ActionResult } from "@/types/action-result";
import { ValidationError } from "@/lib/errors/validation-error";
import { formatZodFieldErrors } from "@/lib/utils/zod-utils";
import { uploadImage } from "@/lib/cloudinary";
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_MB,
} from "@/constants/images";
import {
  MOVIE_RELEASE_YEAR_MAX,
  MOVIE_RELEASE_YEAR_MIN,
  MOVIE_TITLE_MAX_LENGTH,
} from "../constants/validation";

export async function createMovieAction(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const title = formData.get("title")?.toString() ?? "";
  const releaseYear = formData.get("releaseYear")?.toString() ?? "";
  const movieType = formData.get("movieType")?.toString() ?? "";
  const genreIds = formData.getAll("genreIds").map((genre) => genre.toString());
  const image = formData.get("image");

  const movie = {
    title,
    releaseYear,
    movieType,
    genreIds,
    image,
  };

  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(
        MOVIE_TITLE_MAX_LENGTH,
        `Title must be less than ${MOVIE_TITLE_MAX_LENGTH} characters`,
      ),
    movieType: z.coerce
      .number("Invalid movie type")
      .refine((val) => Object.values(MovieType).includes(val), {
        message: "Invalid movie type",
      }),
    releaseYear: z
      .string()
      .trim()
      .min(1, "Release year is required")
      .pipe(
        z.coerce
          .number<string>("Release year must be a number")
          .min(
            MOVIE_RELEASE_YEAR_MIN,
            `Release year must be at least ${MOVIE_RELEASE_YEAR_MIN}`,
          )
          .max(MOVIE_RELEASE_YEAR_MAX, `Release year cannot be in the future`),
      ),
    genreIds: z
      .array(z.coerce.number())
      .min(1, "At least one genre must be selected"),
    image: z
      .custom<File>((val) => val instanceof File, {
        message: "Invalid file upload.",
      })
      .refine(
        (file) => file.size === 0 || file.size <= MAX_IMAGE_SIZE,
        `Max image size is ${MAX_IMAGE_SIZE_MB}MB.`,
      )
      .refine(
        (file) => file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
        `Only ${ACCEPTED_IMAGE_EXTENSIONS.join(", ")} formats are supported.`,
      ),
  });

  const parsedMovie = schema.safeParse(movie);

  if (!parsedMovie.success) {
    const flattened = z.flattenError(parsedMovie.error);
    return {
      success: false,
      fieldErrors: formatZodFieldErrors(flattened.fieldErrors),
    };
  }

  const { image: imageFile, ...movieData } = parsedMovie.data;

  let imageUrl: string | null = null;
  if (imageFile.size > 0) {
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
    if (error instanceof ValidationError) {
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
