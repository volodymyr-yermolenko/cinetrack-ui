"use client";

import { useCallback, useState } from "react";
import { Movie } from "../types/movie";
import MovieCard from "./movie-card";
import { getMovies } from "../api/get-movies";
import SearchInput from "@/components/common/search-input";
import { Plus } from "lucide-react";
import Link from "next/link";

interface MovieListProps {
  initialMovies: Movie[];
  genreId?: number;
}

export default function MovieList({ initialMovies, genreId }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  // TODO: Use isLoading to show skeletons instead of spinner, because spinner looks bad when the loading takes less than a second
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (searchValue: string) => {
      if (!searchValue.trim()) {
        setMovies(initialMovies);
        return;
      }
      setIsLoading(true);
      try {
        const movies = await getMovies(genreId, searchValue);
        setMovies(movies);
      } finally {
        setIsLoading(false);
      }
    },
    [genreId, initialMovies],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row p-4 bg-white rounded-lg shadow gap-x-4">
        <SearchInput
          placeholder="Search movies..."
          onSearch={handleSearch}
        ></SearchInput>
        <Link
          href="/movies/create"
          className="btn-primary flex flex-row items-center gap-x-2"
        >
          <Plus className="w-5 h-5" />
          Add Movie
        </Link>
      </div>
      <div className="flex flex-wrap gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
