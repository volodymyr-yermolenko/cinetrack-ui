import { Genre } from "@/app/movies/types/genre";

export function getGenreList(items: Genre[]): string {
  return items.map((g) => g.name).join(", ");
}
