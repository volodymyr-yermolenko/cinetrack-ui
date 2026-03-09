import { ViewingContextType } from "@/app/watch-entries/types/viewing-context-type";
import { MovieType } from "../app/movies/types/movie-type";

export const MOVIE_TYPE_MAP: Record<MovieType, string> = {
  [MovieType.Movie]: "Movie",
  [MovieType.Series]: "Series",
};

export const VIEWING_CONTEXT_MAP: Record<ViewingContextType, string> = {
  [ViewingContextType.Alone]: "Alone",
  [ViewingContextType.WithFriends]: "With Friends",
  [ViewingContextType.WithFamily]: "With Family",
  [ViewingContextType.WithPartner]: "With Partner",
};
