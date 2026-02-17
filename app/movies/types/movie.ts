import { Genre } from "./genre";
import { MovieType } from "./movie-type";

export interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  movieType: MovieType;
  imageUrl: string;
  genres: Genre[];
}
