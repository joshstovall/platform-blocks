import { SegmentedControl } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <SegmentedControl
      defaultValue="react"
      data={[
        { label: 'React', value: 'react' },
        { label: 'Angular', value: 'angular' },
        { label: 'Vue', value: 'vue' },
      ]}
    />
  )
}
