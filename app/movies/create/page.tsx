import MovieEditor from "../components/movie-editor";
import { getGenres } from "../api/get-genres";
import { query } from "@/lib/utils/api-utils";

export default async function CreateMoviePage() {
  const genres = await query(() => getGenres());
  return <MovieEditor genres={genres} />;
}
