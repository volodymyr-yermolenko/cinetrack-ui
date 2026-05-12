import { ViewingContext } from "@/app/watch-entries/types/viewing-context";
import { MovieType } from "../app/movies/types/movie-type";

export const MOVIE_TYPE_MAP: Record<MovieType, string> = {
  [MovieType.Movie]: "Movie",
  [MovieType.Series]: "Series",
};

export const VIEWING_CONTEXT_MAP: Record<ViewingContext, string> = {
  [ViewingContext.Alone]: "Alone",
  [ViewingContext.WithFriends]: "With Friends",
  [ViewingContext.WithFamily]: "With Family",
  [ViewingContext.WithPartner]: "With Partner",
};
