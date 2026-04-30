"use client";

import { Movie } from "@/app/movies/types/movie";
import { FormField } from "@/components/ui/form-field";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createWatchEntryAction } from "../actions/create-watch-entry-action";
import { ViewingContext } from "../types/viewing-context";
import { VIEWING_CONTEXT_MAP } from "@/constants/movies";
import { DatePicker } from "react-datepicker";
import {
  formatDateForApi,
  getCurrentDate,
  getFirstDayOfYear,
} from "@/lib/utils/date-utils";
import Select from "@/components/ui/select";
import { Rating } from "@/components/ui/rating";
import { mapToNumericSelectOptions } from "@/lib/utils/sys-utils";
import { WatchEntry } from "../types/watch-entry";
import { updateWatchEntryAction } from "../actions/update-watch-entry-action";
import WatchEntryMovieInfo from "./watch-entry-movie-info";

interface WatchEntryEditorProps {
  movies: Movie[];
  watchEntry?: WatchEntry;
}

interface FormState {
  movieId: number | null;
  rating: number;
  viewingContext: ViewingContext;
  watchedDate: Date | null;
  review: string;
}

type FieldName = keyof FormState;

const viewingContextOptions = mapToNumericSelectOptions(VIEWING_CONTEXT_MAP);

export default function WatchEntryEditor({
  movies,
  watchEntry,
}: WatchEntryEditorProps) {
  const isEditMode = !!watchEntry;
  const today = getCurrentDate();

  const [formState, setFormState] = useState<FormState>({
    movieId: isEditMode ? watchEntry.movie.id : null,
    rating: isEditMode ? watchEntry.rating : 0,
    viewingContext: isEditMode
      ? watchEntry.viewingContext
      : ViewingContext.Alone,
    watchedDate: isEditMode ? watchEntry.watchedDate : today,
    review: isEditMode ? (watchEntry.review ?? "") : "",
  });
  const { movieId, rating, viewingContext, watchedDate, review } = formState;

  const [changedFields, setChangedFields] = useState<Set<FieldName>>(
    new Set<FieldName>(),
  );

  const movieOptions = useMemo(
    () =>
      movies.map((movie) => ({
        value: movie.id,
        label: movie.title,
      })),
    [movies],
  );

  const action =
    isEditMode && watchEntry
      ? updateWatchEntryAction.bind(null, watchEntry.id)
      : createWatchEntryAction;
  const [actionState, formAction, isPending] = useActionState(action, {
    success: false,
  });

  useEffect(() => {
    if (!actionState.success && actionState.fieldErrors) {
      setChangedFields(new Set<FieldName>());
    }
  }, [actionState]);

  const getFieldError = (fieldName: FieldName) => {
    if (changedFields.has(fieldName)) return;
    return !actionState.success
      ? actionState.fieldErrors?.[fieldName]
      : undefined;
  };

  const movieError = getFieldError("movieId");
  const ratingError = getFieldError("rating");
  const viewingContextError = getFieldError("viewingContext");
  const watchedDateError = getFieldError("watchedDate");
  const reviewError = getFieldError("review");
  const formErrors = !actionState.success ? actionState.formErrors : undefined;

  const movie = movies.find((m) => m.id === movieId) || null;
  const minWatchedDate = movie
    ? getFirstDayOfYear(movie.releaseYear)
    : undefined;

  const setChangedField = (fieldName: FieldName) => {
    setChangedFields((prev) => new Set(prev).add(fieldName));
  };

  const handleMovieChange = (movieId: number | null) => {
    setChangedField("movieId");
    setFormState((prevState: FormState) => ({
      ...prevState,
      movieId,
    }));
  };

  const handleViewingContextChange = (
    viewingContext: ViewingContext | null,
  ) => {
    setChangedField("viewingContext");
    if (!viewingContext) return;
    setFormState((prevState) => ({
      ...prevState,
      viewingContext,
    }));
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChangedField("review");
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleWatchedDateChange = (date: Date | null) => {
    setChangedField("watchedDate");
    setFormState((prevState) => ({ ...prevState, watchedDate: date }));
  };

  const handleRatingChange = (rating: number) => {
    setChangedField("rating");
    setFormState((prevState) => ({ ...prevState, rating }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set(
      "watchedDate",
      watchedDate ? formatDateForApi(watchedDate) : "",
    );
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="w-[800px] mx-auto">
      <div className="p-4">
        <Link
          href="/watch-entries"
          className="hover:text-blue-600 transition-colors flex items-center"
        >
          <ArrowLeft className="inline-block w-5 h-5 mr-1" />
          Back to Watches
        </Link>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">
          {isEditMode ? "Edit Watch Entry" : "Add Watch Entry"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            {/* Movie */}
            <div className="flex flex-col gap-1">
              <label htmlFor="movieId" className="font-semibold">
                Movie *
              </label>
              <Select
                id="movieId"
                name="movieId"
                value={movie?.id ?? null}
                onChange={handleMovieChange}
                options={movieOptions}
              ></Select>
              {movieError && (
                <p className="text-red-500 text-sm mt-1">{movieError}</p>
              )}
              {movie && <WatchEntryMovieInfo movie={movie} />}
            </div>

            {/* Watch Date */}
            <div className="flex flex-col gap-1">
              <label htmlFor="watchedDate" className="font-semibold">
                Watch Date *
              </label>
              <DatePicker
                showIcon
                id="watchedDate"
                name="watchedDate"
                placeholderText=""
                dateFormat="dd.MM.yyyy"
                selected={watchedDate}
                minDate={minWatchedDate}
                maxDate={today}
                enableTabLoop={false}
                popperPlacement="bottom-start"
                autoComplete="off"
                onChange={handleWatchedDateChange}
                className="form-input w-full"
              />
              {watchedDateError && (
                <p className="text-red-500 text-sm mt-1">{watchedDateError}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Rating *</label>
              <Rating
                value={rating}
                starSize="large"
                isEditable={true}
                showTextValue={true}
                onChange={handleRatingChange}
              />
              {ratingError && (
                <p className="text-red-500 text-sm mt-1">{ratingError}</p>
              )}
              <input type="hidden" name="rating" value={rating} />
            </div>

            {/* Viewing Context */}
            <div className="flex flex-col gap-1">
              <label htmlFor="viewingContext" className="font-semibold">
                Watched with
              </label>
              <Select
                id="viewingContext"
                name="viewingContext"
                value={viewingContext}
                onChange={handleViewingContextChange}
                options={viewingContextOptions}
              ></Select>
              {viewingContextError && (
                <p className="text-red-500 text-sm mt-1">
                  {viewingContextError}
                </p>
              )}
            </div>

            {/* Review */}
            <FormField
              fieldType="textarea"
              label="Review"
              name="review"
              value={review}
              rows={3}
              onChange={handleReviewChange}
              error={reviewError}
            />
          </div>
          <hr className="border-gray-300 my-4"></hr>

          {/* Save button */}
          <button
            className="btn btn-main btn-primary"
            type="submit"
            disabled={isPending}
          >
            {!isPending ? (
              "Save Watch Entry"
            ) : (
              <LoaderCircle className="mx-2 animate-spin" />
            )}
          </button>

          {formErrors && formErrors.length > 0 && (
            <div className="mt-4">
              {formErrors.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
