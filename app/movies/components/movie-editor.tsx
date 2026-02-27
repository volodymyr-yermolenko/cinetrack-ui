"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Genre } from "../types/genre";
import { MovieType } from "../types/movie-type";
import { MOVIE_TYPE_MAP } from "@/constants/movies";
import { createMovieAction } from "../actions/create-movie-action";
import { startTransition, useActionState, useEffect, useState } from "react";
import { getCurrentYear } from "@/lib/utils/date-utils";
import { LoaderCircle } from "lucide-react";
import { FormField, FormFieldType } from "@/components/ui/form-field";
import { ACCEPTED_IMAGE_TYPES } from "@/constants/images";

interface MovieEditorProps {
  genres: Genre[];
}

interface FormState {
  title: string;
  releaseYear: string;
  movieType: MovieType;
  genreIds: number[];
}

type FieldName = keyof FormState | "image";

export default function MovieEditor({ genres }: MovieEditorProps) {
  const [formState, setFormState] = useState<FormState>({
    title: "",
    releaseYear: "",
    movieType: MovieType.Movie,
    genreIds: [],
  });
  const { title, releaseYear, movieType, genreIds } = formState;

  const [changedFields, setChangedFields] = useState<Set<FieldName>>(
    new Set<FieldName>(),
  );

  const [actionState, formAction, isPending] = useActionState(
    createMovieAction,
    {
      success: false,
    },
  );

  const setChangedField = (fieldName: FieldName) => {
    setChangedFields((prev) => new Set(prev).add(fieldName));
  };

  const getFieldError = (fieldName: FieldName) => {
    return !changedFields.has(fieldName)
      ? actionState.fieldErrors?.[fieldName]
      : undefined;
  };

  const titleError = getFieldError("title");
  const releaseYearError = getFieldError("releaseYear");
  const movieTypeError = getFieldError("movieType");
  const genresError = getFieldError("genreIds");
  const imageError = getFieldError("image");
  const formErrors = actionState.formErrors;

  const handleStringInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormState;
    const value = e.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    setChangedField(name as FieldName);
  };

  const handleMovieTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      movieType: Number(e.target.value) as MovieType,
    }));
    setChangedField("movieType");
  };

  const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFormState((prevState) => ({
      ...prevState,
      genreIds: e.target.checked
        ? [...prevState.genreIds, value]
        : prevState.genreIds.filter((id) => id !== value),
    }));
    setChangedField("genreIds");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangedField("image");
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (!actionState.success && actionState.fieldErrors) {
      setChangedFields(new Set());
    }
  }, [actionState]);

  const currentYear = getCurrentYear();

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
            <FormField
              fieldType={FormFieldType.Text}
              label="Title"
              name="title"
              value={title}
              onChange={handleStringInputChange}
              error={titleError}
            />
            <FormField
              fieldType={FormFieldType.Number}
              label="Release Year"
              name="releaseYear"
              value={releaseYear}
              onChange={handleStringInputChange}
              placeHolder={currentYear.toString()}
              error={releaseYearError}
            />
            <div className="flex flex-col gap-1">
              <label htmlFor="movieType" className="font-semibold">
                Movie Type
              </label>
              <select
                name="movieType"
                id="movieType"
                value={movieType}
                onChange={handleMovieTypeChange}
                className="form-input"
              >
                <option value={MovieType.Movie}>
                  {MOVIE_TYPE_MAP[MovieType.Movie]}
                </option>
                <option value={MovieType.Series}>
                  {MOVIE_TYPE_MAP[MovieType.Series]}
                </option>
              </select>
            </div>
            {movieTypeError && (
              <p className="text-red-500 text-sm mt-1">{movieTypeError}</p>
            )}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Genres</label>
              <div className="grid grid-flow-col grid-rows-6 w-96 gap-x-1">
                {genres.map((genre) => (
                  <div className="flex items-center gap-x-2" key={genre.id}>
                    <input
                      id={`${genre.id}`}
                      name="genreIds"
                      type="checkbox"
                      value={genre.id}
                      checked={genreIds.includes(genre.id)}
                      onChange={handleGenresChange}
                    />
                    <label htmlFor={`${genre.id}`}>{genre.name}</label>
                  </div>
                ))}
              </div>
              {genresError && (
                <p className="text-red-500 text-sm mt-1">{genresError}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(", ")}
                id="image"
                name="image"
                onChange={handleImageChange}
              />
              {imageError && (
                <p className="text-red-500 text-sm mt-1">{imageError}</p>
              )}
            </div>
          </div>
          <button
            className="btn-primary mt-6 transition-colors"
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
