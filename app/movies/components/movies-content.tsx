import { getGenres } from "../api/get-genres";
import { getMovies } from "../api/get-movies";
import { Genre } from "../types/genre";
import GenreList from "./genre-list";
import MovieList from "./movie-list";

interface MoviesContentProps {
  genreId?: number;
}

export default async function MoviesContent({ genreId }: MoviesContentProps) {
  const genres = (await getGenres()) as Genre[];
  const movies = await getMovies(genreId);

  return (
    <div className="py-8 flex flex-row gap-x-8">
      <div className="w-64">
        <GenreList genres={genres} activeGenreId={genreId} />
      </div>
      <div className="flex-1">
        <MovieList initialMovies={movies} genreId={genreId}></MovieList>
      </div>
    </div>
  );
}
