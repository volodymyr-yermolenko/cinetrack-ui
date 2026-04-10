import { ViewingContext } from "./viewing-context";

export interface UpdateWatchEntry {
  movieId: number;
  rating: number;
  viewingContext: ViewingContext;
  watchedDate: Date;
  review: string;
}
