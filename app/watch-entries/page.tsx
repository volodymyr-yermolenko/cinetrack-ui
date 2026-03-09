import { getGenres } from "../movies/api/get-genres";
import { GetWatchEntries } from "./api/get-watch-entries";
import WatchEntryList from "./components/watch-entry-list";

export default async function WatchEntriesPage() {
  const genres = await getGenres();
  const watchEntries = await GetWatchEntries();

  return (
    <div className="py-8 w-full">
      <WatchEntryList initialWatchEntries={watchEntries} />
    </div>
  );
}
