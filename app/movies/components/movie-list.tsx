"use client";

import { Movie } from "../types/movie";
import MovieCard from "./movie-card";
import SearchInput from "@/components/common/search-input";
import { Plus } from "lucide-react";
import Link from "next/link";
import NoItemsPanel from "@/components/common/no-items-panel";
import { usePathname, useRouter } from "next/navigation";

interface MovieListProps {
  movies: Movie[];
  search?: string;
}

export default function MovieList({ movies, search }: MovieListProps) {
  const router = useRouter();
  const pathName = usePathname();

  const handleSearch = (searchValue: string) => {
    const params = new URLSearchParams();
    const trimmedSearch = searchValue.trim();
    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row p-4 bg-white rounded-lg shadow gap-x-4">
        <SearchInput
          placeholder="Search movies..."
          value={search}
          onSearch={handleSearch}
        ></SearchInput>
        <Link
          href="/movies/create"
          className="btn btn-main btn-primary flex flex-row items-center gap-x-2"
        >
          <Plus className="w-5 h-5" />
          Add Movie
        </Link>
      </div>
      {movies.length === 0 ? (
        <NoItemsPanel />
      ) : (
        <div className="flex flex-wrap gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
