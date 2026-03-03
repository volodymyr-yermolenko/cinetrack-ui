import z from "zod";
import {
  MOVIE_RELEASE_YEAR_MAX,
  MOVIE_RELEASE_YEAR_MIN,
  MOVIE_TITLE_MAX_LENGTH,
} from "../constants/validation";
import { MovieType } from "../types/movie-type";
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_MB,
} from "@/constants/images";

export function validateMovie(
  formData: FormData,
): z.ZodSafeParseResult<MovieInput> {
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

  return movieValidationSchema.safeParse(movie);
}

const movieValidationSchema = z.object({
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
    .custom<File | null>((val) => val === null || val instanceof File, {
      message: "Invalid file upload.",
    })
    .refine((file) => {
      if (!file || file.size === 0) return true;
      return file.size <= MAX_IMAGE_SIZE;
    }, `Max image size is ${MAX_IMAGE_SIZE_MB}MB.`)
    .refine(
      (file) => {
        if (!file || file.size === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      `Only ${ACCEPTED_IMAGE_EXTENSIONS.join(", ")} formats are supported.`,
    ),
});

type MovieInput = z.infer<typeof movieValidationSchema>;
