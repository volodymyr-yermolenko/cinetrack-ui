import { getGenres } from "../api/get-genres";
import { Genre } from "../types/genre";
import GenreList from "./genre-list";
import MovieList from "./movie-list";

interface MoviesProps {
  genreId?: number;
}

export default async function MoviesContent({ genreId }: MoviesProps) {
  const genres = (await getGenres()) as Genre[];

  return (
    <div className="py-8 flex flex-row gap-x-8">
      <div className="w-64">
        <GenreList genres={genres} activeGenreId={genreId} />
      </div>
      <div className="flex-1">
        <MovieList genreId={genreId}></MovieList>
      </div>
    </div>
  );
}
