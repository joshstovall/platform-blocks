import { SegmentedControl, Column, Text } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Column gap="md">
      <Column gap="xs">
        <Text size="sm" weight="600">Normal</Text>
        <SegmentedControl
          defaultValue="react"
          data={[
            { label: 'React', value: 'react' },
            { label: 'Angular', value: 'angular' },
            { label: 'Vue', value: 'vue' },
          ]}
        />
      </Column>
      
      <Column gap="xs">
        <Text size="sm" weight="600">Disabled</Text>
        <SegmentedControl
          disabled
          defaultValue="code"
          data={[
            { label: 'Preview', value: 'preview' },
            { label: 'Code', value: 'code' },
            { label: 'Export', value: 'export' },
          ]}
        />
      </Column>
      
      <Column gap="xs">
        <Text size="sm" weight="600">Read Only</Text>
        <SegmentedControl
          readOnly
          defaultValue="medium"
          data={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]}
        />
      </Column>
      
      <Column gap="xs">
        <Text size="sm" weight="600">Individual Item Disabled</Text>
        <SegmentedControl
          defaultValue="typescript"
          data={[
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Flow', value: 'flow', disabled: true },
          ]}
        />
      </Column>
    </Column>
  )
}
