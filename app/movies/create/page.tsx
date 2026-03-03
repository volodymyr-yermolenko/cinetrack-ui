import MovieEditor from "../components/movie-editor";
import { getGenres } from "../api/get-genres";

export default async function CreateMoviePage() {
  const genres = await getGenres();
  return <MovieEditor genres={genres} />;
}
