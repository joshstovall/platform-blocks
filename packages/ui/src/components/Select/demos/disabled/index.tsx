import { useState } from 'react'

import { Column, Select, Text } from '@platform-blocks/ui'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana (disabled)', value: 'banana', disabled: true },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Dragonfruit', value: 'dragonfruit' },
]

export default function Demo() {
  const [value, setValue] = useState<string | null>('apple')

  return (
    <Column gap="lg">
      <Text weight="semibold">Disabled options and state</Text>
      <Text size="sm" colorVariant="secondary">
        Prevent specific options from being selected or disable the entire control.
      </Text>

      <Column gap="sm">
        <Select
          label="Disabled option example"
          helperText="Banana is not selectable"
          options={options}
          value={value ?? undefined}
          onChange={(val) => setValue(val as string)}
        />
        <Text size="xs" colorVariant="secondary">
          Current value: {value}
        </Text>
      </Column>

      <Column gap="sm">
        <Select
          label="Entire select disabled"
          options={options}
          value={value ?? undefined}
          disabled
        />
        <Text size="xs" colorVariant="secondary">
          Disable the component when the workflow is read-only or loading.
        </Text>
      </Column>
    </Column>
  )
}
