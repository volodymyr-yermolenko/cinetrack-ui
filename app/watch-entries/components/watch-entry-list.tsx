"use client";

import SearchInput from "@/components/common/search-input";
import { WatchEntry } from "../types/watch-entry";
import WatchEntryCard from "./watch-entry-card";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { GetWatchEntries } from "../api/get-watch-entries";
import { Genre } from "@/app/movies/types/genre";
import NoItemsPanel from "@/components/common/no-items-panel";

interface WatchEntryListProps {
  initialWatchEntries: WatchEntry[];
  genres: Genre[];
}

export default function WatchEntryList({
  initialWatchEntries,
  genres,
}: WatchEntryListProps) {
  const [watchEntries, setWatchEntries] =
    useState<WatchEntry[]>(initialWatchEntries);
  const [searchValue, setSearchValue] = useState("");
  const [genreId, setGenreId] = useState<number | null>(null);
  // TODO: Use isLoading to show skeletons instead of spinner, because spinner looks bad when the loading takes less than a second
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = async (
    searchValue: string,
    genreId: number | null,
  ) => {
    if (!searchValue.trim() && !genreId) {
      setWatchEntries(initialWatchEntries);
      return;
    }
    setIsLoading(true);
    try {
      const watchEntries = await GetWatchEntries(
        genreId || undefined,
        searchValue,
      );
      setWatchEntries(watchEntries);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = useCallback(
    async (searchValue: string) => {
      setSearchValue(searchValue);
      await handleFilterChange(searchValue, genreId);
    },
    [genreId],
  );

  const handleGenreChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = e.target.value ? Number(e.target.value) : null;
    setGenreId(genreId);
    await handleFilterChange(searchValue, genreId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row p-4 bg-white rounded-lg shadow gap-x-4">
        <SearchInput
          placeholder="Search movies..."
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
