import z from "zod";
import { ViewingContext } from "../types/viewing-context";

export function validateWatchEntry(
  formData: FormData,
): z.ZodSafeParseResult<WatchEntryInput> {
  const movieId = formData.get("movieId")?.toString() ?? "";
  const watchedDate = formData.get("watchedDate")?.toString() ?? "";
  const rating = formData.get("rating")?.toString() ?? "";
  const review = formData.get("review")?.toString() ?? "";
  const viewingContext = formData.get("viewingContext")?.toString() ?? "";

  const watchEntry = {
    movieId,
    watchedDate,
    rating,
    review,
    viewingContext,
  };

  return watchEntryValidationSchema.safeParse(watchEntry);
}

const watchEntryValidationSchema = z.object({
  movieId: z
    .string()
    .trim()
    .min(1, "Movie is required")
    .pipe(z.coerce.number<string>({ message: "Movie ID must be a number" })),
  watchedDate: z
    .string()
    .trim()
    .min(1, "Watched date is required")
    .pipe(z.coerce.date<string>({ message: "Invalid date format" })),
  rating: z
    .string()
    .trim()
    .min(1, "Rating is required")
    .pipe(
      z.coerce
        .number<string>({ message: "Rating must be a number" })
        .min(1, "Rating is required")
        .max(10, "Rating cannot be more than 10"),
    ),
  review: z.string().trim().max(200, "Review cannot exceed 200 characters"),
  viewingContext: z.coerce
    .number({ message: "Invalid viewing context type" })
    .refine((val) => Object.values(ViewingContext).includes(val), {
      message: "Invalid viewing context",
    }),
});

type WatchEntryInput = z.infer<typeof watchEntryValidationSchema>;
