import { Badge, Row } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Row gap={8} wrap="wrap">
      <Badge>Default</Badge>
      <Badge variant="filled">Filled</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="light">Light</Badge>
      <Badge variant="subtle">Subtle</Badge>
    </Row>
  )
}