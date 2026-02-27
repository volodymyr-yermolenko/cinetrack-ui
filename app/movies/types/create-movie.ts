import { MovieType } from "./movie-type";

export interface CreateMovie {
  title: string;
  releaseYear: number;
  movieType: MovieType;
  imageUrl: string | null;
  genreIds: number[];
}
