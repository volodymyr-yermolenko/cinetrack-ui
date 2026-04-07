import { MOVIE_TYPE_MAP } from "@/constants/movies";
import { mapToNumericSelectOptions, SelectOption } from "@/lib/utils/sys-utils";
import { MovieType } from "../types/movie-type";
import { SingleValue } from "react-select";

export function useMovieTypeSelect(
  movieType: MovieType,
  onChange: (movieType: MovieType) => void,
) {
  const movieTypeOptions = mapToNumericSelectOptions<MovieType>(MOVIE_TYPE_MAP);

  const selectedMovieTypeOption = movieTypeOptions.find(
    (option) => option.value === movieType,
  );

  const handleMovieTypeChange = (
    selectedOption: SingleValue<SelectOption<MovieType>>,
  ) => {
    if (!selectedOption) return;
    onChange(selectedOption.value);
  };

  return {
    movieTypeOptions,
    selectedMovieTypeOption,
    handleMovieTypeChange,
  };
}
