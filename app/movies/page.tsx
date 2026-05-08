import MoviesContent from "./components/movies-content";

interface MoviesPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { search } = await searchParams;
  return <MoviesContent search={search} />;
}
