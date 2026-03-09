import { Movie } from "@/app/movies/types/movie";
import { ViewingContextType } from "./viewing-context-type";

export interface WatchEntry {
  id: string;
  rating: number;
  viewingContext: ViewingContextType;
  watchedAt: Date;
  review?: string;
  movie: Movie;
}
