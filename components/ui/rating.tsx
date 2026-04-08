import { Star } from "lucide-react";
import { useState } from "react";

interface RatingProps {
  value: number;
  starSize: "small" | "large";
  isEditable?: boolean;
  onChange?: (newValue: number) => void;
}

export function Rating({
  value,
  starSize,
  isEditable = false,
  onChange,
}: RatingProps) {
  const maxValue = 10;
  const currentValue = Math.min(value, maxValue);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const displayedValue = hoveredValue ?? currentValue;

  const starSizeValue = starSize === "small" ? 14 : 22;
  // Size of the cell containing the star, slightly larger than the star itself to allow for hover effects
  const starCellSizeValue = starSizeValue + 3;

  const getStarSizeValue = (index: number) =>
    index === hoveredValue ? starCellSizeValue : starSizeValue;

  const getStarClassName = (index: number) => {
    const fillClassName =
      index <= displayedValue
        ? "fill-yellow-400 text-yellow-400"
        : "fill-transparent text-gray-300";
    return `${fillClassName} transition-all duration-150`;
  };

  return (
    <div
      className={`flex items-center gap-[2px] ${isEditable ? "cursor-pointer" : ""}`}
      onMouseLeave={isEditable ? () => setHoveredValue(null) : undefined}
    >
      {Array.from({ length: maxValue }, (_, i) => {
        const starValue = i + 1;
        return (
          <div
            style={{
              width: starCellSizeValue,
              height: starCellSizeValue,
            }}
            className="flex items-center justify-center"
            key={starValue}
          >
            <Star
              strokeWidth={2}
              size={getStarSizeValue(starValue)}
              onMouseEnter={
                isEditable ? () => setHoveredValue(starValue) : undefined
              }
              onClick={isEditable ? () => onChange?.(starValue) : undefined}
              className={getStarClassName(starValue)}
            />
          </div>
        );
      })}
      <span className="ml-3">{`${currentValue}/${maxValue}`}</span>
    </div>
  );
}
