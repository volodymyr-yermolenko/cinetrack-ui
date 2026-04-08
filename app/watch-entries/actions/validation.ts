import z from "zod";

export function validateWatchEntry(
  formData: FormData,
): z.ZodSafeParseResult<WatchEntryInput> {
  const movieId = formData.get("movieId")?.toString() ?? "";
  const watchedDate = formData.get("watchedDate")?.toString() ?? "";
  const rating = formData.get("rating")?.toString() ?? "";
  const review = formData.get("review")?.toString() ?? "";
  const viewingContext = formData.get("viewingContext")?.toString() ?? "";

  const movie = {
    movieId,
    watchedDate,
    rating,
    review,
    viewingContext,
  };

  return watchEntryValidationSchema.safeParse(movie);
}

const watchEntryValidationSchema = z.object({
  movieId: z
    .number({ message: "Movie ID must be a number" })
    .min(1, "Movie is required"),
  watchedDate: z
    .string()
    .trim()
    .min(1, "Watched date is required")
    .pipe(z.coerce.date({ message: "Invalid date format" })),
  rating: z
    .string()
    .trim()
    .min(1, "Rating is required")
    .pipe(z.coerce.number({ message: "Rating must be a number" })),
  review: z.string().trim().max(1000, "Review cannot exceed 1000 characters"),
  viewingContext: z.number(),
});

type WatchEntryInput = z.infer<typeof watchEntryValidationSchema>;
