import { Badge, Column } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Column gap="sm">
      <Badge size="xs">Extra Small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
      <Badge size="xl">Extra Large</Badge>
    </Column>
  )
}