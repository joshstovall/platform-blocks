import { Chip, Row } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Row gap={8} wrap="wrap">
      <Chip>Default</Chip>
      <Chip variant="filled">Filled</Chip>
      <Chip variant="outline">Outline</Chip>
      <Chip variant="light">Light</Chip>
      <Chip variant="subtle">Subtle</Chip>
    </Row>
  )
}