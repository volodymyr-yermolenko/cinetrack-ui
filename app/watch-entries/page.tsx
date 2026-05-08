import { query } from "@/lib/utils/api-utils";
import { getGenres } from "../movies/api/get-genres";
import { getWatchEntries } from "./api/get-watch-entries";
import WatchEntryList from "./components/watch-entry-list";

interface WatchEntriesPageProps {
  searchParams: Promise<{
    genreId?: string;
    search?: string;
  }>;
}

export default async function WatchEntriesPage({
  searchParams,
}: WatchEntriesPageProps) {
  const params = await searchParams;
  const genreId = params.genreId ? Number(params.genreId) : undefined;
  const search = params.search ?? undefined;

  const genres = await query(() => getGenres());
  const watchEntries = await query(() => getWatchEntries(genreId, search));

  return (
    <div className="py-8 w-full">
      <WatchEntryList
        watchEntries={watchEntries}
        genres={genres}
        search={search}
        genreId={genreId}
      />
    </div>
  );
}
