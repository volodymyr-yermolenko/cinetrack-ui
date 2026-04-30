import { query } from "@/lib/utils/api-utils";
import { getGenres } from "../../api/get-genres";
import { getMovie } from "../../api/get-movie";
import MovieEditor from "../../components/movie-editor";

interface EditMoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);
  const genres = await query(() => getGenres());
  const movie = await query(() => getMovie(movieId));

  return <MovieEditor genres={genres} movie={movie} />;
}
