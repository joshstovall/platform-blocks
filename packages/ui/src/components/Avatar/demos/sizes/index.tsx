import { Avatar, Block } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Block align="center" direction="row" gap="sm">
      <Avatar size="xs" fallback="XS" />
      <Avatar size="sm" fallback="SM" />
      <Avatar size="md" fallback="MD" />
      <Avatar size="lg" fallback="LG" />
      <Avatar size="xl" fallback="XL" />
    </Block>
  )
}