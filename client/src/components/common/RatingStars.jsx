import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, count, size = 'sm', showScore = true }) => {
  const numRating = Number(rating) || 0;
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const currentSize = starSizes[size] || starSizes.sm;
  const currentTextSize = textSizes[size] || textSizes.sm;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(numRating);
          return (
            <Star
              key={star}
              className={`${currentSize} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          );
        })}
      </div>

      {showScore && (
        <span className={`font-semibold text-slate-700 ${currentTextSize}`}>
          {numRating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className={`text-slate-400 ${currentTextSize}`}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
