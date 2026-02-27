interface EditMoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const { id } = await params;
  const genreId = Number(id);

  return <div className="p-8">Edit Movie {genreId}</div>;
}
