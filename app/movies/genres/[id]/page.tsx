import MoviesContent from "../../components/movies-content";

interface MoviesByGenrePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string }>;
}

export default async function MoviesByGenrePage({
  params,
  searchParams,
}: MoviesByGenrePageProps) {
  const { id } = await params;
  const genreId = Number(id);
  const { search } = await searchParams;

  return <MoviesContent genreId={genreId} search={search} />;
}
