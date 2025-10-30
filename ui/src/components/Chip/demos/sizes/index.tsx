import { Chip, Column } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Column wrap="wrap" >
      <Chip size="xs">Extra Small</Chip>
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
      <Chip size="xl">Extra Large</Chip>
    </Column>
  )
}