export default function MoviesPage() {
  return (
    <div>
      <h1>Movies</h1>
      <label htmlFor="search">Search Movies</label>
      <input
        type="text"
        id="search"
        placeholder="Search movies..."
        className="p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400"
      />
    </div>
  );
}
