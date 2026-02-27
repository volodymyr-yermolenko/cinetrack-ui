import { MovieType } from "../app/movies/types/movie-type";

export const MOVIE_TYPE_MAP: Record<MovieType, string> = {
  [MovieType.Movie]: "Movie",
  [MovieType.Series]: "Series",
};
