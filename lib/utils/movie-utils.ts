import { Genre } from "@/app/movies/types/genre";

export function formatGenreNames(items: Genre[]): string {
  return items.map((g) => g.name).join(", ");
}
