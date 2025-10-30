import { useState } from 'react'
import { Chip, Column } from '@platform-blocks/ui'
export default function Demo() {
  const [chips, setChips] = useState(['JavaScript', 'C++', 'Pascal'])
  const handleRemove = (chipToRemove: string) => {
    setChips(chips.filter(chip => chip !== chipToRemove))
  }
  return (
    <Column>
      {chips.map((chip) => (
        <Chip
          key={chip}
          onRemove={() => handleRemove(chip)}
          removePosition="left"
        >
          {chip}
        </Chip>
      ))}
    </Column>
  )
}