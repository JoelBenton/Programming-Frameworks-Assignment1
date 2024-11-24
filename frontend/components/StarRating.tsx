import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, readonly = false }) => {
    return (
        <div className="flex items-center ml-2 ">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => !readonly && onRatingChange(star)}
                    disabled={readonly}
                    className={`${
                        star <= rating ? 'text-yellow-500' : 'text-gray-600'
                    } ${!readonly && 'hover:text-yellow-500'} text-2xl focus:outline-none transition-colors duration-150 ease-in-out`}
                >
          ★
                </button>
            ))}
        </div>
    );
};

export default StarRating;
