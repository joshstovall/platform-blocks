import { Avatar, Column } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Column align="flex-start">
      <Avatar size="xs" fallback="XS" label="Extra Small (xs)" />
      <Avatar size="sm" fallback="SM" label="Small (sm)" />
      <Avatar size="md" fallback="MD" label="Medium (md)" />
      <Avatar size="lg" fallback="LG" label="Large (lg)" />
      <Avatar size="xl" fallback="XL" label="Extra Large (xl)" />
    </Column>
  )
}