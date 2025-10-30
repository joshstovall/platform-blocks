import { useState } from 'react'
import { Rating } from '@platform-blocks/ui'

export default function Demo() {
  const [rating, setRating] = useState(3)
  return (
    <Rating
      value={rating}
      onChange={setRating}
      size="lg"
      label={`Interactive Rating (Current: ${rating})`}
    />
  )
}