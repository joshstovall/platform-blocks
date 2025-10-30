import { useState } from 'react'
import { SegmentedControl, Column, Row, Text, Button } from '@platform-blocks/ui'

const FRAMEWORKS = [
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
]

export default function Demo() {
  const [value, setValue] = useState('react')

  return (
    <Column gap="md">
      <SegmentedControl
        value={value}
        onChange={setValue}
        data={FRAMEWORKS}
      />

      <Text size="sm" colorVariant="muted">
        Selected value: <Text weight="600">{value}</Text>
      </Text>

      <Row gap="sm">
        <Button size="xs" onPress={() => setValue('react')}>Select React</Button>
        <Button size="xs" variant="outline" onPress={() => setValue('angular')}>Select Angular</Button>
        <Button size="xs" variant="outline" onPress={() => setValue('vue')}>Select Vue</Button>
      </Row>
    </Column>
  )
}
