import { getMovies } from "@/app/movies/api/get-movies";
import WatchEntryEditor from "../../components/watch-entry-editor";
import { getWatchEntry } from "../../api/get-watch-entry";

interface EditWatchEntryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditWatchEntryPage({
  params,
}: EditWatchEntryPageProps) {
  const { id } = await params;
  const watchEntryId = Number(id);

  const movies = await getMovies();
  const watchEntry = await getWatchEntry(watchEntryId);

  return (
    <WatchEntryEditor
      movies={movies}
      watchEntry={watchEntry}
    ></WatchEntryEditor>
  );
}
