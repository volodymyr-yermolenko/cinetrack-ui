import { ViewingContext } from "./viewing-context";

export interface CreateWatchEntry {
  movieId: number;
  rating: number;
  viewingContext: ViewingContext;
  watchedDate: Date;
  review: string;
}
