import { useState } from 'react'

import { Column, Select, Text } from '@platform-blocks/ui'

const options = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
  { label: 'Delta', value: 'delta' },
]

export default function Demo() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Column gap="sm">
      <Text weight="semibold">Persistent menu</Text>
      <Text size="sm" colorVariant="secondary">
        Keep the menu open after a selection to compare other options quickly.
      </Text>
      <Select
        label="Persistent menu"
        options={options}
        value={value ?? undefined}
        onChange={(val) => setValue(val as string)}
        closeOnSelect={false}
      />
      {value && (
        <Text size="xs" colorVariant="secondary">
          Last picked: {value}
        </Text>
      )}
    </Column>
  )
}
