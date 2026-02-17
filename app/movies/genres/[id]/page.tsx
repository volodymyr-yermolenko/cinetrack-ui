import MoviesContent from "../../components/movies-content";

interface MoviesByGenrePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MoviesByGenrePage({
  params,
}: MoviesByGenrePageProps) {
  const { id } = await params;
  const genreId = Number(id);

  return <MoviesContent genreId={genreId} />;
}
