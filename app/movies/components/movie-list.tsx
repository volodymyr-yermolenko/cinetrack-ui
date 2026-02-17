import { getMovies } from "../api/get-movies";

interface MovieListProps {
  genreId?: number;
}

export default async function MovieList({ genreId }: MovieListProps) {
  const movies = await getMovies(genreId);

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow">
      {movies.map((movie) => (
        <div key={movie.id} className="mb-2">
          <div className="font-semibold">{movie.title}</div>
          <div className="text-sm text-gray-600">{movie.releaseYear}</div>
        </div>
      ))}
    </div>
  );
}
