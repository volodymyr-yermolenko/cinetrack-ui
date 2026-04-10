import { Star } from "lucide-react";
import { useState } from "react";

const MAX_RATING = 10;

interface RatingProps {
  value: number;
  starSize: "small" | "large";
  showTextValue?: boolean;
  isEditable?: boolean;
  onChange?: (newValue: number) => void;
}

export function Rating({
  value,
  starSize,
  showTextValue: showValue = false,
  isEditable = false,
  onChange,
}: RatingProps) {
  const currentValue = Math.min(value, MAX_RATING);
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
      {Array.from({ length: MAX_RATING }, (_, i) => {
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
      {showValue && (
        <span className="ml-3">{`${currentValue} / ${MAX_RATING}`}</span>
      )}
    </div>
  );
}
