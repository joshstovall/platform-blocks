import { SegmentedControl, Row, Column, Text } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Row gap="xl" style={{ alignItems: 'flex-start' }}>
      <Column gap="xs" style={{ flex: 1 }}>
        <Text size="sm" weight="600">Horizontal (default)</Text>
        <SegmentedControl
          orientation="horizontal"
          defaultValue="react"
          data={[
            { label: 'React', value: 'react' },
            { label: 'Angular', value: 'angular' },
            { label: 'Vue', value: 'vue' },
          ]}
        />
      </Column>
      
      <Column gap="xs">
        <Text size="sm" weight="600">Vertical</Text>
        <SegmentedControl
          orientation="vertical"
          defaultValue="code"
          data={[
            { label: 'Preview', value: 'preview' },
            { label: 'Code', value: 'code' },
            { label: 'Export', value: 'export' },
          ]}
        />
      </Column>
    </Row>
  )
}
