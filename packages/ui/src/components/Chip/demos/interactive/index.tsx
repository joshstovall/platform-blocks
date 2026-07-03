import { useState } from 'react'
import { Chip, Column } from '@platform-blocks/ui'

const initialSports = [
  { label: 'Soccer', emoji: '⚽' },
  { label: 'Basketball', emoji: '🏀' },
  { label: 'Tennis', emoji: '🎾' },
]

export default function Demo() {
  const [chips, setChips] = useState(initialSports)

  const handleRemove = (chipToRemove: string) => {
    setChips((current) => current.filter((chip) => chip.label !== chipToRemove))
  }

  return (
    <Column gap="sm">
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          onRemove={() => handleRemove(chip.label)}
        >
          {chip.label}
        </Chip>
      ))}
    </Column>
  )
}