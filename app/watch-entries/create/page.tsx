import { getMovies } from "@/app/movies/api/get-movies";
import WatchEntryEditor from "../components/watch-entry-editor";

export default async function CreateWatchEntryPage() {
  const movies = await getMovies();
  return <WatchEntryEditor movies={movies}></WatchEntryEditor>;
}
