import { SegmentedControl, Column } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Column gap="md">
      <SegmentedControl
        defaultValue="react"
        color="primary"
        data={[
          { label: 'React', value: 'react' },
          { label: 'Angular', value: 'angular' },
          { label: 'Vue', value: 'vue' },
        ]}
      />
      
      <SegmentedControl
        defaultValue="code"
        color="success"
        data={[
          { label: 'Preview', value: 'preview' },
          { label: 'Code', value: 'code' },
          { label: 'Export', value: 'export' },
        ]}
      />
      
      <SegmentedControl
        defaultValue="settings"
        color="purple"
        data={[
          { label: 'Profile', value: 'profile' },
          { label: 'Settings', value: 'settings' },
          { label: 'Privacy', value: 'privacy' },
        ]}
      />
      
      <SegmentedControl
        defaultValue="medium"
        color="#FF6B6B"
        data={[
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ]}
      />
    </Column>
  )
}
