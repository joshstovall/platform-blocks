import { useState } from 'react'

import { Column, Select, Text } from '@platform-blocks/ui'

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
]

export default function Demo() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Column gap="lg" style={{ maxWidth: 360 }}>
      <Text weight="semibold">Full-width variations</Text>
      <Text size="sm" colorVariant="secondary">
        Stretch the select to fill its container and adjust radius tokens as needed.
      </Text>

      <Column gap="sm">
        <Select
          label="Default radius"
          fullWidth
          options={options}
          value={value ?? undefined}
          onChange={(val) => setValue(val as string)}
        />
        <Text size="xs" colorVariant="secondary">
          The trigger matches the parent width while retaining default styling.
        </Text>
      </Column>

      <Column gap="sm">
        <Select
          label="Custom radius"
          radius="xl"
          fullWidth
          options={options}
          value={value ?? undefined}
          onChange={(val) => setValue(val as string)}
        />
        <Text size="xs" colorVariant="secondary">
          Apply radius tokens to align with your design system.
        </Text>
      </Column>
    </Column>
  )
}
