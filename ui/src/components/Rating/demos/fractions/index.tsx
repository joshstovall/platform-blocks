import { useState } from 'react';
import { Rating, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [movieRating, setMovieRating] = useState(4.2);
  const [restaurantRating, setRestaurantRating] = useState(3.7);

  return (
    <Column gap={16}>
        <Text mb="sm">Movie Rating (Current: {movieRating})</Text>
        <Rating
          value={movieRating}
          onChange={setMovieRating}
          allowFraction
          precision={0.1}
          size="lg"
          color="#FFD700"
        />
        <Text variant="caption" colorVariant="secondary" mt="xs">
          Click anywhere on a star to set precise ratings (0.1 increments)
        </Text>
    </Column>
  );
}


