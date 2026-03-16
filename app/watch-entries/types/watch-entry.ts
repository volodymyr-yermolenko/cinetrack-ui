import { Movie } from "@/app/movies/types/movie";
import { ViewingContextType } from "./viewing-context-type";

export interface WatchEntry {
  id: number;
  rating: number;
  viewingContext: ViewingContextType;
  watchedDate: Date;
  review?: string;
  movie: Movie;
}
