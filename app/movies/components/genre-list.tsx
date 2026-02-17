import Link from "next/link";
import { Genre } from "../types/genre";

interface GenreListProps {
  genres: Genre[];
  activeGenreId?: number;
}

export default function GenreList({ genres, activeGenreId }: GenreListProps) {
  const genreList = (
    <ul className="flex flex-col">
      <li>
        <Link
          href="/movies"
          className={getGenreClassName(undefined, activeGenreId)}
        >
          All
        </Link>
      </li>
      {genres.map((genre) => {
        return (
          <li key={genre.id}>
            <Link
              href={`/movies/genres/${genre.id}`}
              className={getGenreClassName(genre.id, activeGenreId)}
            >
              {genre.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow">
      <div className="mb-3 font-semibold text-lg">Genres</div>
      {genreList}
    </div>
  );
}

function getGenreClassName(genreId?: number, activeGenreId?: number) {
  const isCurrentGenreSelected =
    activeGenreId === genreId || (!genreId && !activeGenreId);

  const baseClasses =
    "pl-3 rounded-md h-10 transition-colors text-base flex items-center";
  const activeClasses = isCurrentGenreSelected ? "bg-blue-600 text-white" : "";
  const hoverClass = isCurrentGenreSelected ? "" : "hover:bg-gray-200";

  return `${baseClasses} ${hoverClass} ${activeClasses}`;
}
