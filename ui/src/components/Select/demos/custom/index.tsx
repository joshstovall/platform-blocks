import { useState } from 'react'

import { Block, Column, Select, Text } from '@platform-blocks/ui'

type SportOption = { label: string; value: string; description: string }

const sportsOptions: SportOption[] = [
  {
    label: '🏓 Table Tennis',
    value: 'table-tennis',
    description: 'Fast rallies on a compact table.',
  },
  {
    label: '🏐 Volleyball',
    value: 'volleyball',
    description: 'Six-player rotations at the net.',
  },
  {
  label: '🥍 Lacrosse',
    value: 'lacrosse',
    description: 'Stick handling plus quick transitions.',
  },
  {
    label: '🥅 Water Polo',
    value: 'water-polo',
    description: 'Continuous play in the pool.',
  },
]

export default function Demo() {
  const [value, setValue] = useState<string | null>(sportsOptions[0].value)

  return (
    <Column gap="sm">
      <Text weight="semibold">Custom option rendering</Text>
      <Text size="sm" colorVariant="secondary">
        Render each option with additional detail and selection styling using `renderOption`.
      </Text>
      <Select
        label="Choose a sport"
        placeholder="Pick a sport"
        options={sportsOptions}
        value={value ?? undefined}
        onChange={(selected) => setValue(selected as string)}
        renderOption={(option, _active, selected) => {
          const sportOption = option as SportOption

          return (
            <Block
              direction="column"
              gap="xs"
              style={{
                padding: 12,
                borderRadius: 12,
                backgroundColor: selected ? 'rgba(59,130,246,0.12)' : undefined,
              }}
            >
              <Text weight={selected ? 'semibold' : undefined}>{option.label}</Text>
              <Text size="sm" colorVariant="secondary">
                {sportOption.description}
              </Text>
            </Block>
          )
        }}
      />
      <Text size="xs" colorVariant="secondary">
        Selected: {value}
      </Text>
    </Column>
  )
}
