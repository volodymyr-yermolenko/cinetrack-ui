"use client";

import { Movie } from "@/app/movies/types/movie";
import { FormField } from "@/components/ui/form-field";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { createWatchEntryAction } from "../actions/create-watch-entry-action";
import { ViewingContext } from "../types/viewing-context";
import noImage from "@/public/no-image.jpg";
import Image from "next/image";
import { formatGenreNames } from "@/lib/utils/movie-utils";
import { MOVIE_TYPE_MAP } from "@/constants/movies";
import { DatePicker } from "react-datepicker";
import { getCurrentDate } from "@/lib/utils/date-utils";
import Select, { SingleValue } from "react-select";
import { SelectOption } from "@/lib/utils/sys-utils";

interface WatchEntryEditorProps {
  movies: Movie[];
}

interface FormState {
  movie: Movie | null;
  rating: number;
  viewingContext: ViewingContext;
  watchedDate: Date | null;
  review: string;
}

export default function WatchEntryEditor({ movies }: WatchEntryEditorProps) {
  const [formState, setFormState] = useState<FormState>({
    movie: null,
    rating: 0,
    viewingContext: ViewingContext.Alone,
    watchedDate: getCurrentDate(),
    review: "",
  });

  const { movie, rating, viewingContext, watchedDate, review } = formState;
  const genres = movie ? formatGenreNames(movie.genres) : "";
  const movieType = movie ? MOVIE_TYPE_MAP[movie.movieType] : "";

  const [actionState, formAction, isPending] = useActionState(
    createWatchEntryAction,
    { success: false },
  );

  const formErrors = actionState.formErrors;

  const movieOptions: SelectOption<number>[] = movies.map((movie) => ({
    value: movie.id,
    label: movie.title,
  }));
  const selectedMovieOption =
    movieOptions.find((option) => option.value === movie?.id) || null;

  const handleMovieChange = (
    selectedOption: SingleValue<SelectOption<number>>,
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      movie: movies.find((m) => m.id === selectedOption?.value) || null,
    }));
  };

  const handleStringInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormState;
    const value = e.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleWatchedDateChange = (date: Date | null) => {
    setFormState((prevState) => ({ ...prevState, watchedDate: date }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="w-[800px] mx-auto">
      <div className="p-4">
        <Link
          href="/movies"
          className="hover:text-blue-600 transition-colors flex items-center"
        >
          <ArrowLeft className="inline-block w-5 h-5 mr-1" />
          Back to Movies
        </Link>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Add New Movie</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="movieId" className="font-semibold">
                Movie
              </label>
              <Select
                instanceId="movieId"
                id="movieId"
                name="movieId"
                value={selectedMovieOption}
                onChange={handleMovieChange}
                options={movieOptions}
              ></Select>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 flex flex-row gap-4">
              <div className="w-16 h-24 relative rounded-md overflow-hidden">
                <Image
                  src={movie?.imageUrl || noImage}
                  alt="Selected Image"
                  fill
                  className="object-cover"
                ></Image>
              </div>
              {movie && (
                <div>
                  <div className="font-medium">{movie?.title}</div>
                  <div className="text-sm text-gray-600">
                    <span>{movie.releaseYear}</span>
                    <span> • </span>
                    <span>{genres}</span>
                  </div>
                  <div className="text-sm text-gray-600">{movieType}</div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="watchedDate" className="font-semibold">
                Watch Date
              </label>
              <DatePicker
                showIcon
                id="watchedDate"
                name="watchedDate"
                placeholderText=""
                dateFormat="dd.MM.yyyy"
                selected={watchedDate}
                enableTabLoop={false}
                popperPlacement="bottom-start"
                onChange={handleWatchedDateChange}
                className="form-input w-full"
              />
            </div>
            <FormField
              fieldType="text"
              label="Review"
              name="review"
              value={review}
              onChange={handleStringInputChange}
            />
          </div>
          <hr className="border-gray-300 my-4"></hr>
          <button
            className="btn btn-main btn-primary"
            type="submit"
            disabled={isPending}
          >
            {!isPending ? (
              "Save Movie"
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
