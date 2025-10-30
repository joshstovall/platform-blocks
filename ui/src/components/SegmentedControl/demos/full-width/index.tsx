import { SegmentedControl } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <SegmentedControl
      fullWidth
      defaultValue="preview"
      data={[
        { label: 'Preview', value: 'preview' },
        { label: 'Code', value: 'code' },
        { label: 'Export', value: 'export' },
      ]}
    />
  )
}
