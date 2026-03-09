import { Star } from "lucide-react";

interface RatingProps {
  value: number;
}

export function Rating({ value }: RatingProps) {
  const safeValue = Math.min(value, 10);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }, (_, i) => (
        <Star
          key={i}
          strokeWidth={2}
          className={`h-4 w-4 ${i < safeValue ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300"}`}
        />
      ))}
    </div>
  );
}
