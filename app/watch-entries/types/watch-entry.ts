import { Movie } from "@/app/movies/types/movie";
import { ViewingContext } from "./viewing-context";

export interface WatchEntry {
  id: number;
  rating: number;
  viewingContext: ViewingContext;
  watchedDate: Date;
  review?: string;
  movie: Movie;
}
