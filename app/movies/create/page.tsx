import MovieEditor from "../components/movie-editor";
import { getGenres } from "../api/get-genres";
import { Genre } from "../types/genre";

export default async function CreateMoviePage() {
  const genres = (await getGenres()) as Genre[];
  return <MovieEditor genres={genres} />;
}
