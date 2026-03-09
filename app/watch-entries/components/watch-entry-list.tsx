"use client";

import SearchInput from "@/components/common/search-input";
import { WatchEntry } from "../types/watch-entry";
import WatchEntryCard from "./watch-entry-card";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { GetWatchEntries } from "../api/get-watch-entries";

interface WatchEntryListProps {
  initialWatchEntries: WatchEntry[];
}

export default function WatchEntryList({
  initialWatchEntries,
}: WatchEntryListProps) {
  const [watchEntries, setWatchEntries] =
    useState<WatchEntry[]>(initialWatchEntries);
  // TODO: Use isLoading to show skeletons instead of spinner, because spinner looks bad when the loading takes less than a second
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (searchValue: string) => {
      if (!searchValue.trim()) {
        setWatchEntries(initialWatchEntries);
        return;
      }
      setIsLoading(true);
      try {
        const watchEntries = await GetWatchEntries(undefined, searchValue);
        setWatchEntries(watchEntries);
      } finally {
        setIsLoading(false);
      }
    },
    [initialWatchEntries],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row p-4 bg-white rounded-lg shadow gap-x-4">
        <SearchInput
          placeholder="Search movies..."
          onSearch={handleSearch}
        ></SearchInput>
        <Link
          href="/watch-entries/create"
          className="btn btn-main btn-primary flex flex-row items-center gap-x-2"
        >
          <Plus className="w-5 h-5" />
          Add Watch
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {watchEntries.map((entry) => (
          <WatchEntryCard key={entry.id} watchEntry={entry} />
        ))}
      </div>
    </div>
  );
}
