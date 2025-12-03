import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ rating = 5, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5 && rating % 1 < 1;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {/* Dolu yıldızlar */}
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      
      {/* Yarı dolu yıldız (eğer varsa) */}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <Star
            className="w-4 h-4 text-gray-300"
          />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          </div>
        </div>
      )}
      
      {/* Boş yıldızlar */}
      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="w-4 h-4 text-gray-300"
        />
      ))}
    </div>
  );
};

export default Rating;

