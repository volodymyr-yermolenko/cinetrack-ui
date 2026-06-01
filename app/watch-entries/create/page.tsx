import { getMovies } from "@/app/movies/api/get-movies";
import WatchEntryEditor from "../components/watch-entry-editor";
import { query } from "@/lib/utils/api-utils";

export default async function CreateWatchEntryPage() {
  const movies = await query(() => getMovies());
  return <WatchEntryEditor movies={movies}></WatchEntryEditor>;
}
