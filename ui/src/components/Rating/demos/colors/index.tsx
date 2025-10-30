import { useState } from 'react'
import { Rating, Text, Column, Block } from '@platform-blocks/ui'

export default function Demo() {
  const [redRating, setRedRating] = useState(4)
  const [blueRating, setBlueRating] = useState(3)

  return (
    <Column gap={16}>
      <Block>
        <Text mb="sm">Red Theme Rating (Current: {redRating})</Text>
        <Rating
          value={redRating}
          onChange={setRedRating}
          color="#EF4444"
          emptyColor="#FEE2E2"
          hoverColor="#DC2626"
          size="lg"
        />
      </Block>
      <Block>
        <Text mb="sm">Blue Theme Rating (Current: {blueRating})</Text>
        <Rating
          value={blueRating}
          onChange={setBlueRating}
          color="#3B82F6"
          emptyColor="#DBEAFE"
          hoverColor="#2563EB"
          size="lg"
        />
      </Block>
    </Column>
  )
}
