import { useState } from 'react'

import { Column, Select, Text } from '@platform-blocks/ui'

const sportsOptions = [
  { label: '⚽ Soccer', value: 'soccer' },
  { label: '🏀 Basketball', value: 'basketball' },
  { label: '🎾 Tennis', value: 'tennis' },
]

export default function Demo() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Column gap="sm">
      <Text weight="semibold">Basic select</Text>
      <Text size="sm" colorVariant="secondary">
        Choose from a simple list of sports to see the current selection below.
      </Text>
      <Select
        label="Favorite sport"
        placeholder="Choose a sport"
        options={sportsOptions}
        value={value ?? undefined}
        onChange={(selected) => setValue(selected as string)}
      />
      {value && (
        <Text size="xs" colorVariant="secondary">
          Selected: {value}
        </Text>
      )}
    </Column>
  )
}
