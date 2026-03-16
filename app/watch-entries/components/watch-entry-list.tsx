"use client";

import SearchInput from "@/components/common/search-input";
import { WatchEntry } from "../types/watch-entry";
import WatchEntryCard from "./watch-entry-card";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback } from "react";
import { Genre } from "@/app/movies/types/genre";
import NoItemsPanel from "@/components/common/no-items-panel";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

interface WatchEntryListProps {
  watchEntries: WatchEntry[];
  genres: Genre[];
}

export default function WatchEntryList({
  watchEntries,
  genres,
}: WatchEntryListProps) {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") ?? "";
  const genreIdString = searchParams.get("genreId");
  const genreId = genreIdString ? Number(genreIdString) : null;

  const router = useRouter();
  const pathName = usePathname();

  const handleFilterChange = useCallback(
    (searchValue: string, genreId: number | null) => {
      const params = new URLSearchParams();
      if (genreId) {
        params.set("genreId", genreId.toString());
      } else {
        params.delete("genreId");
      }

      const trimmedSearch = searchValue.trim();
      if (trimmedSearch) {
        params.set("search", trimmedSearch);
      } else {
        params.delete("search");
      }
      router.replace(`${pathName}?${params.toString()}`, { scroll: false });
    },
    [router, pathName],
  );

  const handleSearchChange = useCallback(
    (searchValue: string) => {
      handleFilterChange(searchValue, genreId);
    },
    [handleFilterChange, genreId],
  );

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = e.target.value ? Number(e.target.value) : null;
    handleFilterChange(searchValue, genreId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row p-4 bg-white rounded-lg shadow gap-x-4">
        <SearchInput
          placeholder="Search movies..."
          initialValue={searchValue}
          onSearch={handleSearchChange}
        ></SearchInput>
        <select
          name="genre"
          id="genre"
          value={genreId ?? ""}
          onChange={handleGenreChange}
          className="form-input w-64"
        >
          <option value="">All</option>
          {genres.map((genre) => (
            <option value={genre.id} key={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <Link
          href="/watch-entries/create"
          className="btn btn-main btn-primary flex flex-row items-center gap-x-2"
        >
          <Plus className="w-5 h-5" />
          Add Watch
        </Link>
      </div>
      {watchEntries.length === 0 ? (
        <NoItemsPanel />
      ) : (
        <div className="flex flex-col gap-4">
          {watchEntries.map((entry) => (
            <WatchEntryCard key={entry.id} watchEntry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
