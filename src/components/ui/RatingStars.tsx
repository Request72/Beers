import { Star } from "lucide-react";

export function RatingStars({ value }: { value: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const total = 5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < full;
          const half = !filled && hasHalf && i === full;
          return (
            <Star
              key={i}
              className={
                "h-4 w-4 " +
                (filled || half ? "fill-brand-600 text-brand-600" : "text-black/15")
              }
            />
          );
        })}
      </div>
      <span className="text-sm text-ink-500">{value.toFixed(1)}</span>
    </div>
  );
}
