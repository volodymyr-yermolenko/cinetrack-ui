import { Movie } from "@/app/movies/types/movie";
import Image from "next/image";
import noImage from "@/public/no-image.jpg";
import { formatGenreNames } from "@/lib/utils/movie-utils";
import { MOVIE_TYPE_MAP } from "@/constants/movies";

interface WatchEntryMovieInfoProps {
  movie: Movie;
}

export default function WatchEntryMovieInfo({
  movie,
}: WatchEntryMovieInfoProps) {
  const genres = formatGenreNames(movie.genres);
  const movieType = MOVIE_TYPE_MAP[movie.movieType];

  return (
    <div className="bg-gray-50 rounded-lg p-2 flex flex-row gap-4">
      <div className="w-16 h-24 relative rounded-md overflow-hidden">
        <Image
          src={movie.imageUrl || noImage}
          alt="Selected Image"
          fill
          className="object-cover"
        ></Image>
      </div>
      <div>
        <div className="font-semibold">{movie?.title}</div>
        <div className="text-sm text-gray-600">
          <span>{movie.releaseYear}</span>
          <span> • </span>
          <span>{genres}</span>
        </div>
        <div className="text-sm text-gray-600">{movieType}</div>
      </div>
    </div>
  );
}
