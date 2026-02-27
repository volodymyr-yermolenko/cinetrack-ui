"use client";

import Image from "next/image";
import { Movie } from "../types/movie";
import { SquarePen, Trash2 } from "lucide-react";
import { MOVIE_TYPE_MAP } from "@/constants/movies";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const genres = movie.genres.map((g) => g.name).join(", ");
  const movieType = MOVIE_TYPE_MAP[movie.movieType];
  const imageScr = movie.imageUrl || "/no-image.png";
  const baseBtnClasses =
    "py-2 text-sm px-4 rounded-lg transition-colors cursor-pointer flex flex-row flex-1 items-center justify-center";

  return (
    <div
      key={movie.id}
      className="size-[400] bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-shadow flex flex-col"
    >
      <div className="relative w-full h-[250px]">
        <Image
          src={imageScr}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="400px"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="font-semibold text-lg">{movie.title}</div>
          <div className="text-sm text-gray-600">
            <span>{movie.releaseYear}</span>
            <span> • </span>
            <span>{genres}</span>
          </div>
          <div className="text-sm text-gray-600">{movieType}</div>
        </div>
        <div className="flex flex-row gap-3 mt-3">
          <Link
            href={`/movies/edit/${movie.id}`}
            className={`${baseBtnClasses} bg-gray-100 hover:bg-gray-200`}
          >
            <SquarePen className="w-4 h-4 mr-2" />
            <span>Edit</span>
          </Link>
          <button
            className={`${baseBtnClasses} bg-red-50 hover:bg-red-100 text-red-600`}
          >
            <Trash2 className="w-4 h-4 mr-2 text-red-600" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
