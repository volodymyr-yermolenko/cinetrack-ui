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
  const genres = await getGenres();
  const movie = await getMovie(movieId);

  return <MovieEditor genres={genres} movie={movie} />;
}
