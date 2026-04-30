import { query } from "@/lib/utils/api-utils";
import { getGenres } from "../api/get-genres";
import { getMovies } from "../api/get-movies";
import GenreList from "./genre-list";
import MovieList from "./movie-list";

interface MoviesContentProps {
  genreId?: number;
  search?: string;
}

export default async function MoviesContent({
  genreId,
  search,
}: MoviesContentProps) {
  const genres = await query(() => getGenres());
  const movies = await query(() => getMovies(genreId, search));

  return (
    <div className="py-8 flex flex-row gap-x-8">
      <div className="w-64">
        <GenreList genres={genres} activeGenreId={genreId} />
      </div>
      <div className="flex-1">
        <MovieList movies={movies} search={search}></MovieList>
      </div>
    </div>
  );
}
