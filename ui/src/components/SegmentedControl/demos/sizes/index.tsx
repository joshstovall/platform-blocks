import { SegmentedControl, Column } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Column gap="md" style={{ alignItems: 'flex-start' }}>
      <SegmentedControl
        size="xs"
        defaultValue="react"
        data={['React', 'Angular', 'Vue']}
      />
      
      <SegmentedControl
        size="sm"
        defaultValue="react"
        data={['React', 'Angular', 'Vue']}
      />
      
      <SegmentedControl
        size="md"
        defaultValue="react"
        data={['React', 'Angular', 'Vue']}
      />
      
      <SegmentedControl
        size="lg"
        defaultValue="react"
        data={['React', 'Angular', 'Vue']}
      />
      
      <SegmentedControl
        size="xl"
        defaultValue="react"
        data={['React', 'Angular', 'Vue']}
      />
    </Column>
  )
}
