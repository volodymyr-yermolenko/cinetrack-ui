import { MovieType } from "./movie-type";

export interface UpdateMovie {
  title: string;
  releaseYear: number;
  movieType: MovieType;
  imageUrl: string | null;
  genreIds: number[];
}
