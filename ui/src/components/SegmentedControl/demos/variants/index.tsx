import { SegmentedControl, Column, Text } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Column gap="md">
      <Column gap="xs">
        <Text size="sm" weight="600">Default variant</Text>
        <SegmentedControl
          defaultValue="react"
          variant="default"
          data={[
            { label: 'React', value: 'react' },
            { label: 'Angular', value: 'angular' },
            { label: 'Vue', value: 'vue' },
          ]}
        />
      </Column>
      
      <Column gap="xs">
        <Text size="sm" weight="600">Filled variant</Text>
        <SegmentedControl
          defaultValue="code"
          variant="filled"
          color="primary"
          data={[
            { label: 'Preview', value: 'preview' },
            { label: 'Code', value: 'code' },
            { label: 'Export', value: 'export' },
          ]}
        />
      </Column>
      
      <Column gap="xs">
        <Text size="sm" weight="600">Filled with auto contrast</Text>
        <SegmentedControl
          defaultValue="medium"
          variant="filled"
          color="warning"
          autoContrast
          data={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]}
        />
      </Column>
    </Column>
  )
}
